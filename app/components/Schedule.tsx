import { Disclosure } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";

const schedule = [
  {
    title: "Friday - December 1",
    content: (
      <>
        <small className="font-bold uppercase text-orange-700">Kickoff Party</small>
        <br />
        7:00pm | Partying, Networking & Teaming w/ Redbull and DJ Solo Lechuga
        <br />
        <a href="https://lu.ma/8ns1rzxo" className="text-blue-600 hover:text-blue-800 visited:text-purple-600">
          Launch party registration
        </a>
      </>
    ),
  },
  {
    title: "Saturday - December 2",
    content: (
      <>
        <small className="font-bold uppercase text-orange-700">Morning</small>
        <br />
        <time className="block font-medium text-gray-500">8:00 AM | Breakfast</time>
        <time className="block font-medium text-gray-500">9:00 AM | Opening Speeches</time>
        <time className="block font-medium text-gray-500">9:45 AM | Hacking solo or in teams, supported by mentors</time>
        <br />
        <br />
        <small className="font-bold uppercase text-orange-700">Hack Time</small>
        <br />
        <time className="block font-medium text-gray-500">12:00 PM | Lunch</time>
        <time className="block font-medium text-gray-500">01:00 PM | More hacking</time>
        <time className="block font-medium text-gray-500">06:00 PM | Dinner</time>
        <time className="block font-medium text-gray-500">07:00 PM | Even more hacking</time>
        <br />
        <br />
        <small className="font-bold uppercase text-orange-700">
          Periodically
        </small>
        <br />
        Guest lectures by mentors and sponsors
        <br />
        Snacks and surprises
      </>
    ),
  },
  {
    title: "Sunday - December 3",
    content: (
      <>
        <small className="font-bold uppercase text-orange-700">Morning</small>
        <br />
        <time className="block font-medium text-gray-500">09:00 AM | Breakfast</time>
        <time className="block font-medium text-gray-500">10:00 AM | Keep pushing</time>
        <br />
        <br />
        <small className="font-bold uppercase text-orange-700">Midday</small>
        <br />
        <time className="block font-medium text-gray-500">12:00 PM | Lunch</time>
        <time className="block font-medium text-gray-500">03:14 PM | Submit repos and prepare for final presentations</time>
        <br />
        <br />
        <small className="font-bold uppercase text-orange-700">Afternoon</small>
        <br />
        <time className="block font-medium text-gray-500">04:00 PM | Hackfair - Teams do their final pitches</time>
        <time className="block font-medium text-gray-500">05:30 PM | Final Demos</time>
        <br />
        <br />
        <small className="font-bold uppercase text-orange-700">Wrap-up</small>
        <br />
        <time className="block font-medium text-gray-500">06:30 PM | Deliberation &amp; Awards</time>
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
