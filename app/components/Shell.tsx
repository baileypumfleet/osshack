import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { UserButton } from "@clerk/remix";
import GradientHero from "~/components/GradientHero";
import { Link, useMatches } from "@remix-run/react";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Mission Control", href: "/control" },
  { name: "Profile", href: "/profile" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Shell({ children, title }) {
  const matches = useMatches();
  return (
    <>
      <div className="min-h-full">
        <div className="pb-32">
          <GradientHero />
          <Disclosure
            as="nav"
            className="border-opacity-25 lg:border-none"
          >
            {({ open }) => (
              <>
                <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                  <div className="relative flex h-16 items-center justify-between">
                    <div className="flex items-center px-2 lg:px-0">
                      <div className="flex-shrink-0">
                        <Link to="/" className="-m-1.5 p-1.5">
                          <p className="font-cal text-white tracking-wide text-2xl">
                            OSS<span className="opacity-50">hack</span>
                          </p>
                        </Link>
                      </div>
                      <div className="hidden lg:ml-10 lg:block">
                        <div className="flex space-x-4">
                          {navigation.map((item) => (
                            <Link
                              key={item.name}
                              to={item.href}
                              className={classNames(
                                matches[1].pathname === item.href
                                  ? "bg-orange-300 bg-opacity-25 text-white"
                                  : "text-white hover:bg-orange-500 hover:bg-opacity-25",
                                "rounded-md py-2 px-3 text-sm font-medium"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex lg:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-orange-600 p-2 text-orange-200 hover:bg-orange-500 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-600">
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XMarkIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <Bars3Icon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                    <div className="hidden lg:ml-4 lg:block">
                      <div className="flex items-center">
                        {/* <button
                          type="button"
                          className="relative mr-4 flex-shrink-0 rounded-full p-1 text-orange-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-600"
                        >
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">View notifications</span>
                          <BellIcon className="h-6 w-6" aria-hidden="true" />
                        </button> */}

                        {/* Profile dropdown */}
                        <UserButton afterSignOutUrl="/" />
                      </div>
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="lg:hidden">
                  <div className="space-y-1 px-2 pb-3 pt-2">
                    {navigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-orange-300 bg-opacity-25 text-white"
                            : "text-white hover:bg-orange-500 hover:bg-opacity-25",
                          "block rounded-md py-2 px-3 text-base font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                  <div className="pb-3 pt-4">
                    <div className="flex items-center px-5">
                      {/* <button
                        type="button"
                        className="relative ml-auto flex-shrink-0 rounded-full bg-orange-600 p-1 text-orange-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-600"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button> */}
                    </div>
                    <div className="mt-3 space-y-1 px-2">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <header className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
              <h1 className="text-4xl font-cal tracking-w text-white">
                {title || "OSShack"}
              </h1>
            </div>
          </header>
        </div>

        <main className="-mt-32 bg-white pt-12">
          <div className="mx-auto max-w-7xl pb-12">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
