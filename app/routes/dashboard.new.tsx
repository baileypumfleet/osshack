import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/remix";
import type { MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import Shell from "~/components/Shell";
import prisma from "~/lib/prisma";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import Footer from "../components/Footer";
import { getAuth } from "@clerk/remix/ssr.server";
import { createClerkClient } from "@clerk/remix/api.server";
import { Octokit } from "octokit";

export const meta: MetaFunction = () => {
  return [
    { title: "Create a new bounty | OSShack" },
    {
      name: "description",
      content:
        "Win $100k in prizes and contribute to open-source. Hosted in New York and remotely.",
    },
  ];
};

export const action = async (args) => {
  const { userId } = await getAuth(args);
  const clerkUser = await createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  }).users.getUser(userId || "");

  // Lookup the user with the Prisma client
  const user = await prisma.user.findUnique({
    where: { email: clerkUser.emailAddresses[0].emailAddress },
  });

  const formData = await args.request.formData();

  const title = formData.get("title");
  const description = formData.get("description");
  const value = formData.get("reward");
  const github = formData.get("github");

  // Update the user with the Prisma client
  await prisma.bounty.create({
    data: {
      title,
      description,
      github,
      value: parseInt(value as string),
      project: { connect: { id: user?.projectId || 1 } },
    },
  });

  return redirect("/dashboard");
};

export default function New() {
  const actionData = useActionData();
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <SignedIn>
        <Shell title="Bounties">
          <h2 className="text-3xl font-cal text-orange-900 sm:text-5xl my-8">
            Automatically create from GitHub
          </h2>
          <div className="bg-white rounded-md text-gray-900 text-sm shadow-sm py-1">
            {data.issues?.data?.map((issue) => (
              <div key={issue.id} className="px-4 py-2 border-b flex">
                <div className="font-medium pt-1.5">{issue.title}</div>
                <div className="ml-auto">
                  <Form method="post">
                    <input type="hidden" name="title" value={issue.title} />
                    <input type="hidden" name="description" value={issue.body || "Unknown"} />
                    <input type="hidden" name="github" value={issue.html_url} />
                    <input
                      type="number"
                      name="reward"
                      placeholder="$20"
                      className="rounded-md w-16 px-2 py-1 outline-none text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                    <button className="rounded-md bg-orange-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline">
                      Create bounty
                    </button>
                  </Form>
                </div>
              </div>
            ))}
            <div className="px-4 pt-4 pb-3 flex text-gray-400">
              <span className="font-medium text-gray-500">
                Can&apos;t find what you&apos;re looking for?
              </span>
              &nbsp;Reach out to support, or create the issue manually.
            </div>
          </div>
          <h2 className="text-3xl font-cal text-orange-900 sm:text-5xl mb-8 mt-16">
            Manually create a bounty for {data.user?.project?.name || "Unknown"}
          </h2>
          <Form method="post" className="space-y-4">
            <div className="flex flex-col">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Add a short, concise title"
                className="block w-full rounded-md border-0 px-4 py-1.5 outline-none text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Add a detailed description"
                className="block w-full rounded-md border-0 px-4 py-1.5 outline-none text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                GitHub Link
              </label>
              <input
                type="text"
                name="github"
                placeholder="https://github.com/calcom/cal.com/pull/12374"
                className="block w-full rounded-md border-0 px-4 py-1.5 outline-none text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Reward
              </label>
              <input
                type="number"
                name="reward"
                placeholder="$20"
                className="block w-full rounded-md border-0 px-4 py-1.5 outline-none text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <button
                type="submit"
                className="rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                Create bounty
              </button>
            </div>

            {actionData?.error ? (
              <p className="text-red-500">{actionData.error}</p>
            ) : null}
          </Form>
          <Footer />
        </Shell>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
}

export const loader = async (args) => {
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
    include: {
      project: true,
    },
  });

  const issues = await octokit.request("GET /repos/{owner}/{repo}/issues", {
    owner: user?.project?.repo?.split("/")[0] || "calcom",
    repo: user?.project?.repo?.split("/")[1] || "cal.com",
  });

  return json({ user, issues });
};
