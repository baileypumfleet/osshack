import {RedirectToSignIn, SignedIn, SignedOut} from "@clerk/remix";
import type {MetaFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import Shell from "~/components/Shell";
import prisma from "~/lib/prisma";
import {Form, useLoaderData} from "@remix-run/react";
import Footer from "../components/Footer";
import {getAuth} from "@clerk/remix/ssr.server";
import {createClerkClient} from "@clerk/remix/api.server";
import {ExclamationTriangleIcon} from "@heroicons/react/20/solid";

export const meta: MetaFunction = () => {
    return [
        {title: "Review submissions | OSShack"},
        {
            name: "description",
            content:
                "Win $100k in prizes and contribute to open-source. Hosted in New York and remotely.",
        },
    ];
};

export const action = async (args) => {
    const formData = await args.request.formData();
    const submission = formData.get("submission");
    const action = formData.get("action");

    if (action === "APPROVED") {
        // Approve the submission
        await prisma.submission.update({
            where: {id: parseInt(submission)},
            data: {
                status: action,
            },
        });

        // Get the bounty
        const newSubmission = await prisma.submission.findUnique({
            where: {id: parseInt(submission)},
            include: {bounty: true, user: true},
        });

        // Update the bounty status
        await prisma.bounty.update({
            where: {id: newSubmission?.bounty.id},
            data: {
                status: "CLOSED",
            },
        });

        // Send the reward
        const options = {
            method: "POST",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                authorization: "Bearer " + process.env.TREMENDOUS_TOKEN,
            },
            body: JSON.stringify({
                external_id: newSubmission?.id.toString(),
                payment: {funding_source_id: process.env.TREMENDOUS_FUNDING_SOURCE, channel: "API"},
                reward: {
                    campaign_id: process.env.TREMENDOUS_CAMPAIGN_ID,
                    value: {denomination: newSubmission?.bounty.value, currency_code: "USD"},
                    recipient: {name: newSubmission?.user.name, email: newSubmission?.user.email},
                    delivery: {method: "EMAIL"}
                }
            })
        };

        const res = await fetch(process.env.TREMENDOUS_PRODUCTION === "true" ? "https://www.tremendous.com/api/v2/orders" : "https://testflight.tremendous.com/api/v2/orders", options);
        return await res.json();
    } else if (action === "REJECTED") {
        // Delete the submission
        await prisma.submission.delete({
            where: {id: parseInt(submission)},
        });
    }

    return redirect("/review");
};

export default function Review() {
    const data = useLoaderData<typeof loader>();

    if (!data.user?.projectId) {
        return (
            <div>
                <SignedIn>
                    <Shell title="Not allowed">
                        You&apos;re not allowed to see this page. Get out.
                    </Shell>
                </SignedIn>
                <SignedOut>
                    <RedirectToSignIn/>
                </SignedOut>
            </div>
        );
    }
    return (
        <div>
            <SignedIn>
                <Shell title="Review submissions">
                    {data.bounties.length === 0 && (
                        <div className="py-16">
                            <div className="mb-8 text-center">
                                <ExclamationTriangleIcon className="h-12 w-12 text-orange-900 mx-auto mb-4"/>
                                <h2 className="text-3xl font-cal text-orange-900 sm:text-5xl mb-4">
                                    No bounties yet
                                </h2>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                        {data.bounties.map((bounty) => (
                            <div key={bounty.id}>
                                <h2 className="text-3xl font-cal text-orange-900 mb-2">
                                    {bounty.title}
                                </h2>
                                {!bounty.submissions.length && (
                                    <div className="text-gray-700">No submissions yet.</div>
                                )}
                                {bounty.submissions.filter((submission) => submission.status === "APPROVED").length > 0 && (
                                    <div className="text-gray-700">This bounty is now closed.</div>
                                )}
                                <div className="bg-white rounded-md text-gray-900 text-sm shadow-sm">
                                    {bounty.submissions.filter((submission) => submission.status === "SUBMITTED").map((submission) => (
                                        <div
                                            key={submission.id}
                                            className="px-4 py-2 border-b flex"
                                        >
                                            <a
                                                href={submission.url}
                                                className="text-orange-600 font-medium hover:underline mt-0.5"
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {submission.url}
                                            </a>
                                            <div className="ml-auto flex space-x-2">
                                                <Form method="post">
                                                    <input
                                                        type="hidden"
                                                        name="submission"
                                                        value={submission.id}
                                                    />
                                                    <input type="hidden" name="action" value="APPROVED"/>
                                                    <button
                                                        className="rounded-md border border-orange-600 bg-orange-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline">
                                                        Approve
                                                    </button>
                                                </Form>
                                                <Form method="post">
                                                    <input
                                                        type="hidden"
                                                        name="submission"
                                                        value={submission.id}
                                                    />
                                                    <input type="hidden" name="action" value="REJECTED"/>
                                                    <button
                                                        className="rounded-md border border-red-100 bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 shadow-sm hover:bg-red-100 focus-visible:outline">
                                                        Reject
                                                    </button>
                                                </Form>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <Footer/>
                </Shell>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn/>
            </SignedOut>
        </div>
    );
}

export const loader = async (args) => {
    const {userId} = await getAuth(args);
    const clerkUser = await createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
    }).users.getUser(userId || "");

    // Lookup the user with the Prisma client
    const user = await prisma.user.findUnique({
        where: {email: clerkUser.emailAddresses[0].emailAddress},
    });

    const bounties = await prisma.bounty.findMany({
        where: {projectId: user?.projectId || 0},
        include: {submissions: true},
    });

    return json({user, bounties});
};
