import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/remix";
import type {LoaderFunctionArgs, MetaFunction} from "@remix-run/node";
import { json } from "@remix-run/node";
import Shell from "~/components/Shell";
import prisma from "~/lib/prisma";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import Footer from "~/components/Footer";
dayjs.extend(relativeTime);

export const meta: MetaFunction = () => {
  return [
    { title: "Mission Control | OSShack" },
    {
      name: "description",
      content:
        "Win $100k in prizes and contribute to open-source. Hosted in New York and remotely.",
    },
  ];
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <div>
      <SignedIn>
        <Shell title="Mission Control">
          <div className="grid grid-cols-4 gap-8">
            <div className="bg-white rounded-md p-5 col-span-2">
              <p className="text-3xl font-cal text-orange-900 sm:text-5xl mb-2">
                {dayjs("2023-12-04T21:00:00Z").fromNow(true)}
              </p>
              <p className="text-gray-500">Time remaining</p>
            </div>
            <div className="bg-white rounded-md p-5">
              <p className="text-3xl font-cal text-orange-900 sm:text-5xl mb-2">
                {data?.totalBounties}
              </p>
              <p className="text-gray-500">Open bounties remaining</p>
            </div>
            <div className="bg-white rounded-md p-5">
              <p className="text-3xl font-cal text-orange-900 sm:text-5xl mb-2 tracking-wide">
                {formatter.format(data?.totalValue._sum.value || 0)}
              </p>
              <p className="text-gray-500">Still up for grabs</p>
            </div>
            <div className="bg-white rounded-md p-5">
              <p className="text-3xl font-cal text-orange-900 sm:text-5xl mb-2">
                {data?.totalUsers}
              </p>
              <p className="text-gray-500">Participants competing</p>
            </div>
            <div className="bg-white rounded-md p-5">
              <p className="text-3xl font-cal text-orange-900 sm:text-5xl mb-2">
                {data?.totalSubmissions}
              </p>
              <p className="text-gray-500">Submissions</p>
            </div>
            <div className="bg-white rounded-md p-5 col-span-2 row-span-4">
              <h3 className="text-xl font-cal text-orange-900 sm:text-3xl mb-4">
                Top open bounties
              </h3>
              <div className="grid grid-cols-1 gap-y-4">
                {data?.bounties.map((bounty) => (
                  <div
                    key={bounty.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-700">
                        {bounty.title}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {bounty.description?.substring(0, 150)}
                      </p>
                    </div>
                    <div className="text-right w-36">
                      <p className="text-lg font-cal text-orange-900 sm:text-xl">
                        {formatter.format(bounty.value || 0)}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {bounty.type.toLowerCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-md p-5">
              <p className="text-3xl font-cal text-orange-900 sm:text-5xl mb-2">
                {data?.totalProjects}
              </p>
              <p className="text-gray-500">Total projects</p>
            </div>
            <div className="bg-white rounded-md p-5">
              <p className="text-3xl font-cal text-orange-900 sm:text-5xl mb-2">
                {data?.totalChallenges}
              </p>
              <p className="text-gray-500">Open challenges remaining</p>
            </div>
            {/* <div className="bg-white rounded-md p-5 col-span-2 row-span-2">
              <h3 className="text-xl font-cal text-orange-900 sm:text-3xl mb-4">
                Leaderboard
              </h3>
            </div> */}
          </div>
          <Footer />
        </Shell>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
}

export const loader = async (args: LoaderFunctionArgs) => {
  const bounties = await prisma.bounty.findMany({
    orderBy: {
      value: "desc",
    },
  });

  const submissions = await prisma.submission.findMany();

  // Count total users that are open
  const totalUsers = await prisma.user.count();

  // Count total projects that are open
  const totalProjects = await prisma.project.count();

  // Count total submissions that are open
  const totalSubmissions = await prisma.submission.count();

  // Count total bounties that are open
  const totalBounties = await prisma.bounty.count({
    where: {
      status: "OPEN",
      type: "BOUNTY",
    },
  });

  // Count total challenges that are open
  const totalChallenges = await prisma.bounty.count({
    where: {
      status: "OPEN",
      type: "CHALLENGE",
    },
  });

  const totalValue = await prisma.bounty.aggregate({
    where: {
      status: "OPEN",
    },
    _sum: {
      value: true, // Sum up the 'value' field
    },
  });

  return json({
    bounties,
    submissions,
    totalUsers,
    totalProjects,
    totalSubmissions,
    totalBounties,
    totalChallenges,
    totalValue,
  });
};
