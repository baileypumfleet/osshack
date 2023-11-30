import {
  BriefcaseIcon,
  CodeBracketIcon,
  TrophyIcon,
} from "@heroicons/react/20/solid";

export default function WhyJoin({resource}) {
  const features = [
    {
      name: resource["Prizes100K"],
      description: resource["PrizesDescription"],
      icon: TrophyIcon,
    },
    {
      name: resource["JobOpportunity"],
      description: resource["JobOpportunityDescription"],
      icon: BriefcaseIcon,
    },
    {
      name: resource["OSSExperts"],
      description: resource["OSSExpertsDescription"],
      icon: CodeBracketIcon,
    },
  ];
  return (
    <div id="why" className="bg-orange-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
        <h2 className="mt-2 text-3xl font-cal text-orange-900 sm:text-5xl">
          {resource["ReadyToHack"]}
        </h2>
        </div>
        <div className="mx-auto mt-16 max-w-2xl lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col">
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
