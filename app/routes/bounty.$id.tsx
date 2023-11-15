import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/remix";
import { TrashIcon } from "@heroicons/react/20/solid";
import { redirect } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { Form, useLoaderData, useParams } from "@remix-run/react";
import Shell from "~/components/Shell";
import prisma from "~/lib/prisma";
import Markdown from "react-markdown";

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

  await prisma.bounty.delete({
    where: { id: parseInt(id) },
  });

  return redirect("/dashboard");
};

export default function Bounty() {
  const params = useParams();
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <SignedIn>
        <Shell title={data.bounty?.title}>
          <div className="grid grid-cols-3 gap-x-8">
            <div className="col-span-2">
              <h2 className="text-3xl font-cal text-orange-900 mb-2">
                Description
              </h2>
              <div className="prose prose-headings:font-cal prose-headings:text-orange-900 prose-headings:mb-2 prose-headings:font-normal">
                <Markdown>{data.bounty?.description}</Markdown>
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

              <Form method="post">
                <input type="hidden" name="bounty" value={params.id} />
                <button
                  type="submit"
                  className="mt-4 text-red-600 bg-red-100 px-4 py-2 rounded-lg flex font-medium"
                >
                  <TrashIcon className="h-5 w-5 mr-1 mt-0.5" />
                  Delete bounty
                </button>
              </Form>
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
