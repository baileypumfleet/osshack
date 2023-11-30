import { Disclosure } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";

export default function Schedule({resource}) {
  const schedule = [
    {
      title: resource["ScheduleTitle1"],
      content: (
        <>
          <small className="font-bold uppercase text-orange-700">{resource["KickOffParty"]}</small>
          <br />
            {resource["KickOffPartyDesc"]}
          <br />
          <a href="https://lu.ma/8ns1rzxo" className="text-blue-600 hover:text-blue-800 visited:text-purple-600">
            {resource["LaunchPartyReg"]}
          </a>
        </>
      ),
    },
    {
      title: resource["ScheduleTitle2"],
      content: (
        <>
          <small className="font-bold uppercase text-orange-700">{resource["Morning"]}</small>
          <br />
          <time className="block font-medium text-gray-500">{resource["MorningBreakfast"]}</time>
          <time className="block font-medium text-gray-500">{resource["MorningOpeningSpeech"]}</time>
          <time className="block font-medium text-gray-500">{resource["MorningHacking"]}</time>
          <br />
          <br />
          <small className="font-bold uppercase text-orange-700">{resource["HackTime"]}</small>
          <br />
          <time className="block font-medium text-gray-500">{resource["HackLunch"]}</time>
          <time className="block font-medium text-gray-500">{resource["HackMoreHack"]}</time>
          <time className="block font-medium text-gray-500">{resource["HackDinner"]}</time>
          <time className="block font-medium text-gray-500">{resource["HackEvenMore"]}</time>
          <br />
          <br />
          <small className="font-bold uppercase text-orange-700">
            {resource["Periodically"]}
          </small>
          <br />
          {resource["PeriodicallyLectures"]}
          <br />
          {resource["PeriodicallySurprises"]}
        </>
      ),
    },
    {
      title: resource["ScheduleTitle3"],
      content: (
        <>
          <small className="font-bold uppercase text-orange-700">{resource["Morning2"]}</small>
          <br />
          <time className="block font-medium text-gray-500">{resource["Morning2BreakFast"]}</time>
          <time className="block font-medium text-gray-500">{resource["Morning2Push"]}</time>
          <br />
          <br />
          <small className="font-bold uppercase text-orange-700">{resource["Midday"]}</small>
          <br />
          <time className="block font-medium text-gray-500">{resource["MiddayLunch"]}</time>
          <time className="block font-medium text-gray-500">{resource["MiddaySubmit"]}</time>
          <br />
          <br />
          <small className="font-bold uppercase text-orange-700">{resource["Afternoon"]}</small>
          <br />
          <time className="block font-medium text-gray-500">{resource["AfternoonHackFair"]}</time>
          <time className="block font-medium text-gray-500">{resource["AfternoonFinalDemo"]}</time>
          <br />
          <br />
          <small className="font-bold uppercase text-orange-700">{resource["Wrap"]}</small>
          <br />
          <time className="block font-medium text-gray-500">{resource["Deliberation"]} &amp; {resource["Awards"]}</time>
        </>
      ),
    },
  ];
  return (
    <div id="schedule" className="bg-orange-50">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-7xl divide-y divide-orange-900/10">
          <h2 className="mt-2 text-3xl font-cal text-orange-900 sm:text-5xl">
            {resource["Schedule"]}
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-orange-900/10">
            {schedule.map((day, dayId) => (
              <Disclosure
                as="div"
                key={day.title}
                className="pt-6"
                defaultOpen={dayId === 0}
              >
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-orange-900">
                        <span className="text-base font-semibold leading-7">
                          {day.title}
                        </span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusSmallIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          ) : (
                            <PlusSmallIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12 animate-in fade-in">
                      <p className="text-gray-700">{day.content}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
