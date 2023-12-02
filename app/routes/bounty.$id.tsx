import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/remix";
import { redirect } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useParams,
} from "@remix-run/react";
import Shell from "~/components/Shell";
import prisma from "~/lib/prisma";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";
import removeComments from "remark-remove-comments";
import Footer from "~/components/Footer";
import {
  ChevronRightIcon,
  CloudArrowDownIcon,
  CogIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { getAuth } from "@clerk/remix/ssr.server";
import { createClerkClient } from "@clerk/remix/api.server";
import { Octokit } from "octokit";
import { toast, Toaster } from "react-hot-toast";

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

export const action = async (args) => {
  const formData = await args.request.formData();

  const id = formData.get("bounty");
  let octokit;
  let bounty;

  if (args.request.method === "DELETE") {
    await prisma.bounty.delete({
      where: { id: parseInt(id) },
    });

    return redirect("/dashboard");
  } else if (args.request.method === "PATCH") {
    octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    bounty = await prisma.bounty.findUnique({
      where: { id: parseInt(id) },
      include: { project: true },
    });
  }

  if (octokit) {
    const githubBounty = await octokit.request(
      "GET /repos/{owner}/{repo}/issues/{issue_number}",
      {
        owner: bounty?.project?.repo?.split("/")[0] || "calcom",
        repo: bounty?.project?.repo?.split("/")[1] || "cal.com",
        issue_number:
          parseInt(
            bounty?.github
              ? bounty.github.split("/")[bounty.github.split("/").length - 1]
              : "1"
          ) || 1,
      }
    );

    // Update with the latest GitHub description
    return prisma.bounty.update({
      where: { id: parseInt(id) },
      data: {
        description: githubBounty.data.body,
      },
    });
  }
};

export default function Bounty() {
  const params = useParams();
  const actionData = useActionData();
  const data = useLoaderData<typeof loader>();
  const [loading, isLoading] = useState(false);

  useEffect(() => {
    if (actionData) {
      toast.success("Description updated successfully!");
    }
  }, [actionData]);

  return (
    <>
      <SignedIn>
        <Shell title={data.bounty?.title}>
          <div className="grid grid-cols-3 gap-x-8 border rounded-lg bg-gray-50 px-10 py-8">
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
                <Markdown
                  remarkPlugins={[
                    remarkGfm,
                    removeComments,
                    [remarkGithub, { repository: data.bounty?.project.repo }],
                  ]}
                >
                  {data.bounty?.description}
                </Markdown>
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
                      If you&apos;re ready to submit your attempt at this{" "}
                      {data.bounty?.type && data.bounty?.type.toLowerCase()},
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
                paid after approval of your submission, redeemable via
                Tremendous.
              </p>

              {data.bounty?.github && (
                <>
                  <h2 className="text-3xl font-cal text-orange-900 mb-2">
                    GitHub
                  </h2>
                  <a
                    href={data.bounty?.github || ""}
                    target="_blank"
                    rel="noreferrer"
                    className="flex space-x-4 text-gray-900 border bg-white rounded-lg px-5 py-2"
                  >
                    <div className="pt-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-10 h-10 text-gray-900"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </div>
                    <div className="pt-0.5 mb-1.5 w-full flex">
                      <div>
                        <span className="text-sm text-gray-500">View on</span>
                        <p className="text-gray-900 font-medium text-xl leading-5">
                          GitHub
                        </p>
                      </div>
                      <span className="ml-auto mt-3 text-gray-500">
                        <ChevronRightIcon className="h-6 w-6" />
                      </span>
                    </div>
                  </a>
                </>
              )}

              {data.user?.projectId === data.bounty?.project.id && (
                <>
                  <h2 className="text-3xl font-cal text-orange-900 mt-8 mb-2">
                    Admin
                  </h2>
                  <div className="flex space-x-4 mt-4">
                    <Form method="patch">
                      <input type="hidden" name="bounty" value={params.id} />
                      <button
                        type="submit"
                        className="text-blue-600 bg-blue-100 px-2 py-1 text-sm rounded-lg flex font-medium"
                      >
                        <CloudArrowDownIcon className="h-4 w-4 mr-1 mt-0.5" />
                        Update description
                      </button>
                    </Form>
                    <Form method="delete">
                      <input type="hidden" name="bounty" value={params.id} />
                      <button
                        type="submit"
                        className="text-red-600 bg-red-100 px-2 py-1 text-sm rounded-lg flex font-medium"
                      >
                        <TrashIcon className="h-4 w-4 mr-1 mt-0.5" />
                        Delete bounty
                      </button>
                    </Form>
                  </div>
                </>
              )}
            </div>
          </div>
          <Footer />
          <Toaster />
        </Shell>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export const loader = async (args) => {
  const { userId } = await getAuth(args);
  const clerkUser = await createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  }).users.getUser(userId || "");

  // Lookup the user with the Prisma client
  const user = await prisma.user.findUnique({
    where: { email: clerkUser.emailAddresses[0].emailAddress },
  });

  const bounty = await prisma.bounty.findUnique({
    where: { id: parseInt(args.params.id) },
    include: { project: true, submissions: true },
  });
  return { user, bounty };
};
