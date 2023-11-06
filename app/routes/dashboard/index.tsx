import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/remix";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import Shell from "~/components/Shell";
import prisma from "~/lib/prisma";
import { useLoaderData } from "@remix-run/react";
import { ClockIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
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

  if (data.error) {
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
                  <a href="/profile" className="font-semibold underline">
                    the profile page
                  </a>
                </div>
                <div className="border border-dashed border-orange-900 rounded px-4 py-2 text-orange-900">
                  Follow us on{" "}
                  <a href="/profile" className="font-semibold underline">
                    Twitter (empty link)
                  </a>
                </div>
                <div className="border border-dashed border-orange-900 rounded px-4 py-2 text-orange-900">
                  Join our{" "}
                  <a href="/profile" className="font-semibold underline">
                    Discord (empty link)
                  </a>
                </div>
              </div>
            </div>
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
        <Shell>
          {data.map((project) => (
            <div key={project.id} className="mb-16">
              <h2 className="text-3xl font-cal text-orange-900 sm:text-5xl mb-4">
                {project.name}
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {project.bounties.map((bounty) => (
                  <div
                    key={bounty.id}
                    className="border border-dashed border-orange-900 rounded p-4"
                  >
                    <h3 className="text-2xl font-cal text-orange-900">
                      {bounty.title}
                    </h3>
                    <p className="text-sm text-gray-700">
                      {bounty.description}
                    </p>
                  </div>
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
        </Shell>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
}

export const loader = async () => {
  if (process.env.LIVE === "true") {
    return json(await prisma.project.findMany({ include: { bounties: true } }));
  } else {
    return json({ error: "Not in live mode" });
  }
};
