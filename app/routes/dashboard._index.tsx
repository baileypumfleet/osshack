import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/remix";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import Shell from "~/components/Shell";
import prisma from "~/lib/prisma";
import { useLoaderData, Link } from "@remix-run/react";
import { ClockIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import Sponsors from "../components/Sponsors";
import Footer from "../components/Footer";
import { getAuth } from "@clerk/remix/ssr.server";
import { createClerkClient } from "@clerk/remix/api.server";
dayjs.extend(relativeTime);

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard | OSShack" },
    {
      name: "description",
      content:
        "Win $100k in prizes and contribute to open-source. Hosted in New York and remotely.",
    },
  ];
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  if (!data.user?.projectId) {
    return (
      <div>
        <SignedIn>
          <Shell title="Dashboard">
            <div className="py-16">
              <div className="mb-8 text-center">
                <ClockIcon className="h-12 w-12 text-orange-900 mx-auto mb-4" />
                <h2 className="text-3xl font-cal text-orange-900 sm:text-5xl mb-4">
                  OSShack starts in{" "}
                  {dayjs("2023-12-01T12:00:00Z").fromNow(true)}
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-dashed border-orange-900 rounded px-4 py-2 text-orange-900">
                  Fill out your details on{" "}
                  <Link to="/profile" className="font-semibold underline">
                    the profile page
                  </Link>
                </div>
                <div className="border border-dashed border-orange-900 rounded px-4 py-2 text-orange-900">
                  Share this on{" "}
                  <a
                    href="https://twitter.com/intent/tweet?text=I'm%20participating%20in%20OSShack%2C%20where%20you%20can%20earn%20prizes%20with%20bounties%20and%20challenges%20in%20open%20source%20projects.%20Join%20us%20on%20December%201-3%20remotely%20or%20in%20NYC!&url=https%3A%2F%2Fosshack.com"
                    className="font-semibold underline"
                  >
                    Twitter
                  </a>
                </div>
                <div className="border border-dashed border-orange-900 rounded px-4 py-2 text-orange-900">
                  Need help?{" "}
                  <a
                    href="mailto:bailey@pumfleet.co.uk"
                    className="font-semibold underline"
                  >
                    Get in touch
                  </a>
                </div>
              </div>
            </div>
            <Sponsors />
            <Footer />
          </Shell>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </div>
    );
  }
  return (
    <div>
      <SignedIn>
        <Shell title="Dashboard">
          {data.projects.map((project) => (
            <div key={project.id} className="mb-16">
              <h2 className="text-3xl font-cal text-orange-900 sm:text-5xl mb-4">
                {project.name}
              </h2>
              {data.user?.projectId === project.id && (
                <div className="flex">
                  <Link
                    to="/dashboard/new"
                    className="text-orange-500 hover:text-orange-700 text-xl font-cal"
                  >
                    <PencilSquareIcon className="w-4 h-4 mb-0.5 inline-block" />{" "}
                    Create a new bounty
                  </Link>
                  <div className="ml-auto pt-0.5">
                    {data.allocated && data.allocated > 0 && (
                      <span className="text-orange-900 text-xl font-cal">
                        ${data.allocated} out of ${project.budget} allocated
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4 mt-4">
                {project.bounties.map((bounty) => (
                  <Link
                    to={`/bounty/${bounty.id}`}
                    key={bounty.id}
                    className="border border-dashed border-orange-900 hover:border-orange-500 group rounded p-4 relative"
                  >
                    <h3 className="text-2xl font-cal text-orange-900 group-hover:text-orange-500 group-hover:underline">
                      {bounty.title}
                    </h3>
                    <span className="text-2xl font-cal text-orange-300 absolute top-2 right-2">
                      ${bounty.value}
                    </span>
                    <p className="text-sm text-gray-700">
                      {bounty.description.length > 50
                        ? bounty.description.substring(0, 50) + "..."
                        : bounty.description}
                    </p>
                  </Link>
                ))}
                {project.bounties.length === 0 && (
                  <div className="border border-dashed border-orange-900 rounded p-4 col-span-3 text-orange-900 text-center">
                    <strong className="font-semibold">{project.name}</strong>{" "}
                    has ran out of bounties. Check back soon!
                  </div>
                )}
              </div>
            </div>
          ))}
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
  });

  const projects = await prisma.project.findMany({
    include: { bounties: true },
    orderBy: { id: "asc" },
  });

  const totalValue = await prisma.bounty.aggregate({
    where: {
      projectId: user?.projectId || 1,
    },
    _sum: {
      value: true, // Sum up the 'value' field
    },
  });

  return json({ user, projects, allocated: totalValue._sum.value });
};
