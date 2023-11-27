import { Disclosure } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";

const schedule = [
  {
    title: "Friday - December 1",
    content: (
      <>
        <small className="font-bold uppercase text-orange-700">Kickoff Party</small>
        <br />
        Partying, Networking & Teaming
      </>
    ),
  },
  {
    title: "Saturday - December 2",
    content: (
      <>
        <small className="font-bold uppercase text-orange-700">Morning</small>
        <br />
        Tech Panels &amp; Career Fair
        <br />
        <br />
        <small className="font-bold uppercase text-orange-700">All day</small>
        <br />
        Hacking solo or in teams, supported by mentors
        <br />
        <br />
        <small className="font-bold uppercase text-orange-700">
          Periodically
        </small>
        <br />
        Guest lectures by mentors and sponsors
      </>
    ),
  },
  {
    title: "Sunday - December 3",
    content: (
      <>
        <small className="font-bold uppercase text-orange-700">Midday</small>
        <br />
        Submit repos and prepare for final presentations
        <br />
        <br />
        <small className="font-bold uppercase text-orange-700">Afternoon</small>
        <br />
        Hackfair - Teams do their final pitches
        <br />
        <br />
        <small className="font-bold uppercase text-orange-700">Wrap-up</small>
        <br />
        Deliberation &amp; Awards
      </>
    ),
  },
];

export default function Schedule() {
  return (
    <div id="schedule" className="bg-orange-50">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-7xl divide-y divide-orange-900/10">
          <h2 className="mt-2 text-3xl font-cal text-orange-900 sm:text-5xl">
            Schedule
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
