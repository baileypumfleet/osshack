import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/remix";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import Shell from "~/components/Shell";
import prisma from "~/lib/prisma";

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

export default function Bounty() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <SignedIn>
        <Shell title={data.bounty.title}>
          <div className="grid grid-cols-3 gap-x-8">
            <div className="col-span-2">
              <h2 className="text-3xl font-cal text-orange-900 mb-2">
                Description
              </h2>
              {data.bounty.description}
            </div>
            <div>
              <h2 className="text-3xl font-cal text-orange-900 mb-2">
                Reward
              </h2>
              <p className="text-gray-800 mb-8">
                <span className="font-semibold text-gray-900">${data.bounty.value}</span> paid via gift card, bank transfer or PayPal withdrawal.
              </p>

              <h2 className="text-3xl font-cal text-orange-900 mb-2">
                GitHub
              </h2>
              <p className="text-gray-900">{data.bounty.github}</p>
            </div>
          </div>
        </Shell>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export const loader = async ({ params }) => {
  const bounty = await prisma.bounty.findUnique({
    where: { id: parseInt(params.id) },
  });
  return { bounty };
};
