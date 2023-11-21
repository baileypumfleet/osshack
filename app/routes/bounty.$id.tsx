import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/remix";
import {ActionFunctionArgs, LoaderFunctionArgs, redirect} from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { Form, Link, useLoaderData, useParams } from "@remix-run/react";
import Shell from "~/components/Shell";
import prisma from "~/lib/prisma";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";
// @ts-ignore
import removeComments from "remark-remove-comments";
import Footer from "~/components/Footer";
import {
  CogIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";
import { getAuth } from "@clerk/remix/ssr.server";
import { createClerkClient } from "@clerk/remix/api.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Bounty | OSShack" },
    {
      name: "description",
      content:
        "Win $100k in prizes and contribute to open-source. Hosted in New York and remotely.",
    },
  ];
};

export const action = async (args: ActionFunctionArgs) => {
  const formData = await args.request.formData();

  const id = formData.get("bounty");

  await prisma.bounty.delete({
    where: { id: parseInt(id as string) },
  });

  return redirect("/dashboard");
};

export default function Bounty() {
  const params = useParams();
  const data = useLoaderData<typeof loader>();
  const [loading, isLoading] = useState(false);

  return (
    <>
      <SignedIn>
        <Shell title={data.bounty?.title}>
          <div className="grid grid-cols-3 gap-x-8">
            <div className="col-span-2">
              {data.bounty?.submissions &&
                data.bounty?.submissions.filter(
                  (submission) => submission.status === "APPROVED"
                ).length === 0 &&
                data.bounty?.submissions.length > 0 && (
                  <div className="mb-4 text-red-500 bg-red-100 px-4 py-2 rounded-md w-full">
                    <ExclamationTriangleIcon className="inline h-5 w-5 mr-2 pb-0.5" />
                    <h3 className="inline text-red-600 font-medium text-lg">
                      A submission has been filed for this bounty.
                    </h3>
                    <p className="text-sm mb-1">
                      Whilst you still can submit a solution, please note that
                      you will be competing against other submissions.
                    </p>
                    <ul className="text-sm list-disc ml-8 font-medium">
                      {data.bounty?.submissions.map((submission) => (
                        <li key={submission.id}>
                          <a
                            href={submission.url}
                            className="text-red-900 hover:text-red-500 underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {submission.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              <h2 className="text-3xl font-cal text-orange-900 mb-2">
                Description
              </h2>
              <div className="prose prose-headings:font-cal prose-headings:text-orange-900 prose-headings:mb-2 prose-headings:font-normal">
                <Markdown remarkPlugins={[remarkGfm, removeComments, [remarkGithub, {repository: data.bounty?.project.repo}]]}>{data.bounty?.description}</Markdown>
              </div>
              <div className="bg-white border border-gray-300 border-b-4 border-b-gray-200 rounded-lg p-5 mt-8">
                <h2 className="text-3xl font-cal text-orange-900 mb-2">
                  Submit
                </h2>
                {data.bounty?.submissions &&
                data.bounty?.submissions.filter(
                    (submission) => submission.status === "APPROVED"
                ).length === 0 ? (
                    <>
                      <p className="text-gray-700">
                        If you&apos;re ready to submit your attempt at this {data.bounty?.type && data.bounty?.type.toLowerCase()},
                        please make sure the following is completed:
                        <ul className="list-disc ml-8 mt-2 text-gray-500 space-y-1">
                          <li>
                            You have your{" "}
                            <span className="font-semibold text-gray-700">
                          GitHub username
                        </span>{" "}
                            set correctly in your profile
                          </li>
                          <li>
                            You have submitted an{" "}
                            <span className="font-semibold text-gray-700">
                          open pull request
                        </span>{" "}
                            in the {data.bounty?.project.repo} repository
                          </li>
                        </ul>
                      </p>
                      <Link
                          to={`/submit/${params.id}`}
                          onClick={() => isLoading(true)}
                          className="mt-4 text-white bg-orange-600 px-4 py-2 rounded-md flex font-medium w-48"
                      >
                        {loading === true ? (
                            <CogIcon className="h-5 w-5 mr-1.5 mt-0.5 animate-spin" />
                        ) : (
                            <PaperAirplaneIcon className="h-5 w-5 mr-1.5 mt-0.5" />
                        )}
                        Submit a solution
                      </Link>
                    </>
                ) : (
                    <p className="text-gray-700">
                      This bounty is now closed. Thank you for your contributions!
                    </p>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-cal text-orange-900 mb-2">Reward</h2>
              <p className="text-gray-800 mb-8">
                <span className="font-semibold text-gray-900">
                  ${data.bounty?.value}
                </span>{" "}
                paid via gift card, bank transfer or PayPal withdrawal.
              </p>

              <h2 className="text-3xl font-cal text-orange-900 mb-2">GitHub</h2>
              <p className="text-gray-900">
                {data.bounty?.github ||
                  "We can't seem to find the GitHub link. Contact the team for help."}
              </p>

              {data.user?.projectId === data.bounty?.project.id && (
                <Form method="post">
                  <input type="hidden" name="bounty" value={params.id} />
                  <button
                    type="submit"
                    className="mt-4 text-red-600 bg-red-100 px-4 py-2 rounded-md flex font-medium"
                  >
                    <TrashIcon className="h-5 w-5 mr-1 mt-0.5" />
                    Delete bounty
                  </button>
                </Form>
              )}
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

  // Lookup the user with the Prisma client
  const user = await prisma.user.findUnique({
    where: { email: clerkUser.emailAddresses[0].emailAddress },
  });

  const bounty = await prisma.bounty.findUnique({
    where: { id: parseInt(args.params.id as string) },
    include: { project: true, submissions: true },
  });
  return { user, bounty };
};
