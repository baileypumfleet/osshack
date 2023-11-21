import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/remix";
import {ActionFunctionArgs, LoaderFunctionArgs, redirect} from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import Shell from "~/components/Shell";
import prisma from "~/lib/prisma";
import Footer from "~/components/Footer";
import { Octokit } from "octokit";
import { createClerkClient } from "@clerk/remix/api.server";
import { getAuth } from "@clerk/remix/ssr.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Submit a solution | OSShack" },
    {
      name: "description",
      content:
        "Win $100k in prizes and contribute to open-source. Hosted in New York and remotely.",
    },
  ];
};

export const action = async (args: ActionFunctionArgs) => {
  const { userId } = await getAuth(args);
  const clerkUser = await createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  }).users.getUser(userId || "");

  // Lookup the user with the Prisma client
  const user = await prisma.user.findUnique({
    where: { email: clerkUser.emailAddresses[0].emailAddress },
  });

  const formData = await args.request.formData();

  const url = formData.get("url");

  await prisma.submission.create({
    data: {
      url: url as string,
      bounty: {
        connect: {
          id: parseInt(args.params.id),
        },
      },
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });

  return redirect("/dashboard");
};

export default function Bounty() {
  const actionData = useActionData();
  const data = useLoaderData<typeof loader>();

  console.log(data.pulls);

  return (
    <>
      <SignedIn>
        <Shell title="Submit a solution">
          <div className="grid grid-cols-3 gap-x-8">
            <div className="col-span-2">
              <h2 className="text-3xl font-cal text-orange-900 mb-4">
                Automatically link from GitHub
              </h2>
              <div className="bg-white rounded-md text-gray-900 text-sm shadow-sm">
                {data.pulls?.length === 0 && (
                  <div className="px-4 p-3 border-b text-gray-500">
                    <span className="font-medium text-orange-900">
                      We couldn&apos;t find any PRs made by you.
                    </span>{" "}
                    Make sure your GitHub username is set in your profile.
                  </div>
                )}
                {data.pulls?.map((pull) => (
                  <div key={pull.id} className="px-4 pt-2 pb-3 border-b flex">
                    <div className="font-medium pt-1.5">{pull.title}</div>
                    <div className="ml-auto">
                      <Form method="post">
                        <input type="hidden" name="url" value={pull.html_url} />
                        <button className="mt-0.5 rounded-md bg-orange-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline">
                          Submit this PR
                        </button>
                      </Form>
                    </div>
                  </div>
                ))}
              </div>
              <h2 className="text-3xl font-cal text-orange-900 mb-4 mt-8">
                Manually submit
              </h2>
              <Form method="post" className="space-y-4">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    URL
                  </label>
                  <input
                    type="text"
                    name="url"
                    placeholder="https://github.com/calcom/cal.com/pulls/1"
                    className="block w-full rounded-md border-0 px-4 py-1.5 outline-none text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                  >
                    Submit solution
                  </button>
                </div>

                {actionData?.error ? (
                  <p className="text-red-500">{actionData.error}</p>
                ) : null}
              </Form>
            </div>
          </div>
          <Footer />
        </Shell>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);
  const clerkUser = await createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  }).users.getUser(userId || "");
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  // Lookup the user with the Prisma client
  const user = await prisma.user.findUnique({
    where: { email: clerkUser.emailAddresses[0].emailAddress },
  });

  const bounty = await prisma.bounty.findUnique({
    where: { id: parseInt(args.params.id) },
    include: { project: true },
  });

  const pulls = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
    owner: bounty?.project?.repo?.split("/")[0] || "calcom",
    repo: bounty?.project?.repo?.split("/")[1] || "cal.com",
  });

  const filteredPulls = pulls.data.filter(
    (pull) => pull.user?.login === user?.github
  );

  return { bounty, pulls: filteredPulls };
};
