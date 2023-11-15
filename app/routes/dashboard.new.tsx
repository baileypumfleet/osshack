import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/remix";
import type { MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import Shell from "~/components/Shell";
import prisma from "~/lib/prisma";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import Footer from "../components/Footer";
import { getAuth } from "@clerk/remix/ssr.server";
import { createClerkClient } from "@clerk/remix/api.server";

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

  // Update the user with the Prisma client
  await prisma.bounty.create({
    data: {
      title,
      description,
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
          <h2 className="text-3xl font-cal text-orange-900 sm:text-5xl my-8">
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

  // Lookup the user with the Prisma client
  const user = await prisma.user.findUnique({
    where: { email: clerkUser.emailAddresses[0].emailAddress },
    include: {
      project: true,
    },
  });

  return json({ user });
};
