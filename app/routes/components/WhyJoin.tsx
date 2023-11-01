import {
  BriefcaseIcon,
  CodeBracketIcon,
  TrophyIcon,
} from "@heroicons/react/20/solid";

const features = [
  {
    name: "$100k in prizes",
    description:
      "Compete for a chance to win from a substantial prize pool of $100,000. Showcase your skills, innovate, and stand a chance to be rewarded handsomely for your contributions.",
    icon: TrophyIcon,
  },
  {
    name: "Job opportunities",
    description:
      "Participating in OSShack could open doors to numerous job opportunities. Impress the right people with your skills and you might land your dream job.",
    icon: BriefcaseIcon,
  },
  {
    name: "Work with OSS experts",
    description:
      "Get the unique opportunity to collaborate with open-source software (OSS) experts. Learn from their experience, gain insights into best practices, and enhance your coding skills.",
    icon: CodeBracketIcon,
  },
];

export default function WhyJoin() {
  return (
    <div id="why" className="bg-orange-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
        <h2 className="mt-2 text-3xl font-cal text-orange-900 sm:text-5xl">
          Ready to hack?
        </h2>
        </div>
        <div className="mx-auto mt-16 max-w-2xl lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon
                    className="h-5 w-5 flex-none text-orange-800"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
