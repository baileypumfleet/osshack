import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/remix";
import type { MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import Shell from "~/components/Shell";
import prisma from "~/lib/prisma";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { getAuth } from "@clerk/remix/ssr.server";
import { createClerkClient } from "@clerk/remix/api.server";
import {
  ArrowRightIcon,
  CheckBadgeIcon,
  ClockIcon,
} from "@heroicons/react/20/solid";
import { CheckIcon, PencilIcon } from "@heroicons/react/24/solid";

export const meta: MetaFunction = () => {
  return [
    { title: "Profile | OSShack" },
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
  const formData = await args.request.formData();

  const name = formData.get("name");
  const email =
    formData.get("email") || clerkUser.emailAddresses[0].emailAddress;
  const type = formData.get("type");

  // Update the user with the Prisma client
  const updatedUser = await prisma.user.update({
    where: { email: clerkUser.emailAddresses[0].emailAddress },
    data: { name, email, type },
  });

  // Update the user in Clerk
  const params = {
    firstName: name.split(" ")[0],
    lastName: name.split(" ")[1],
  };
  const clerkUpdatedUser = await createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  }).users.updateUser(clerkUser.id, params);

  return redirect("/profile");
};

export default function Index() {
  const actionData = useActionData();
  const user = useLoaderData<typeof loader>();

  return (
    <div>
      <SignedIn>
        <Shell title="Profile">
          <>
            {!user.confirmed ? (
              <h2 className="text-3xl font-cal text-orange-900 sm:text-5xl mb-8">
                Submit your application
              </h2>
            ) : (
              <h2 className="text-3xl font-cal text-orange-900 sm:text-5xl mb-8">
                You&apos;re all set!
              </h2>
            )}
            <div className="grid md:grid-cols-3 gap-x-8">
              <div className="p-5 text-center">
                <div className="bg-green-600 rounded-full w-24 h-24 flex items-center mx-auto">
                  <CheckIcon className="mx-auto w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-cal text-orange-900 mt-4">
                  Sign up for a OSShack account
                </h3>
                <p className="text-gray-500 text-sm">
                  Create an account and make sure your profile information is
                  correct.
                </p>
              </div>
              <div className="p-5 text-center">
                {!user.confirmed ? (
                  <div className="bg-orange-900 rounded-full w-24 h-24 flex items-center mx-auto">
                    <PencilIcon className="mx-auto w-12 h-12 text-white" />
                  </div>
                ) : (
                  <div className="bg-green-600 rounded-full w-24 h-24 flex items-center mx-auto">
                    <CheckIcon className="mx-auto w-12 h-12 text-white" />
                  </div>
                )}
                <h3 className="text-2xl font-cal text-orange-900 mt-4">
                  Submit your application
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  We&apos;ll ask a few questions about why you want to join the
                  hackathon.
                </p>
                {!user.confirmed && (
                  <a
                    href="https://forms.gle/NivBsEkKB6Biantr9"
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Complete application now{" "}
                    <ArrowRightIcon className="w-4 h-4 inline-block" />
                  </a>
                )}
              </div>
              <div className="p-5 text-center">
                {!user.confirmed ? (
                  <div className="bg-orange-900 rounded-full w-24 h-24 flex items-center mx-auto">
                    <CheckBadgeIcon className="mx-auto w-12 h-12 text-white" />
                  </div>
                ) : (
                  <div className="bg-green-600 rounded-full w-24 h-24 flex items-center mx-auto">
                    <CheckIcon className="mx-auto w-12 h-12 text-white" />
                  </div>
                )}
                <h3 className="text-2xl font-cal text-orange-900 mt-4">
                  Get approved
                </h3>
                <p className="text-gray-500 text-sm">
                  Our team will shortly review and approve your application.
                </p>
              </div>
            </div>
          </>
          <h2 className="text-3xl font-cal text-orange-900 sm:text-5xl my-8">
            Update your details
          </h2>
          <Form method="post" className="space-y-4">
            <div className="flex flex-col">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Full name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={user.name || ""}
                className="block w-full rounded-md border-0 px-4 py-1.5 outline-none text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={user.email}
                className="cursor-not-allowed block w-full rounded-md border-0 px-4 py-1.5 outline-none text-gray-400 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                disabled={true}
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Attendee type
              </label>
              <select
                name="type"
                defaultValue={user.type || "REMOTE"}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm outline-none sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option value="IN_PERSON">In Person</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Status
              </label>
              {user.confirmed ? (
                <p className="text-green-400 font-semibold flex">
                  <CheckBadgeIcon className="w-4 h-4 mr-1 mt-1" /> Confirmed
                </p>
              ) : (
                <p className="text-orange-400 font-semibold flex">
                  <ClockIcon className="w-4 h-4 mr-1 mt-1" /> Unconfirmed
                </p>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                Update Profile
              </button>
            </div>

            {actionData?.error ? (
              <p className="text-red-500">{actionData.error}</p>
            ) : null}
          </Form>
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
  });

  if (!user) {
    const newUser = await prisma.user.create({
      data: {
        email: clerkUser.emailAddresses[0].emailAddress,
        name: clerkUser.firstName + " " + clerkUser.lastName,
        type: "REMOTE",
      },
    });

    return json(newUser);
  }

  return json(user);
};
