export default function Sponsors() {
  return (
    <div id="sponsors" className="bg-orange-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="mt-2 text-3xl font-cal text-orange-900 sm:text-5xl">
          Sponsors
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-6">
          <img
            className="col-span-2 max-h-7 w-full object-contain lg:col-span-1 -mt-2"
            src="/logos/calcom.png"
            alt="Cal.com"
          />
          <img
              className="col-span-2 col-start-2 max-h-10 w-full object-contain sm:col-start-auto lg:col-span-1"
              src="/logos/google.png"
              alt="Google"
          />
          <img
              className="col-span-2 col-start-2 max-h-32 w-full object-contain sm:col-start-auto lg:col-span-1"
              src="/logos/redbull.png"
              alt="Red Bull"
          />
          <img
              className="col-span-2 max-h-8 w-full object-contain lg:col-span-1"
              src="/logos/cornell.png"
              alt="Cornell Tech"
          />
          <img
              className="col-span-2 max-h-8 w-full object-contain lg:col-span-1"
              src="/logos/andrew.png"
              alt="Andrew Yeung"
          />
          <img
              className="col-span-2 max-h-16 w-full object-contain lg:col-span-1"
              src="/logos/numi.png"
              alt="Numi"
          />
          <img
              className="col-span-2 max-h-6 w-full object-contain lg:col-span-1"
              src="/logos/onesafe.png"
              alt="Onesafe"
          />
          <img
              className="col-span-2 max-h-6 w-full object-contain lg:col-span-1"
              src="/logos/remotebase.png"
              alt="Remotebase"
          />
          <img
              className="col-span-2 max-h-6 w-full object-contain lg:col-span-1"
              src="/logos/documenso.png"
              alt="Documenso"
          />
          <img
              className="col-span-2 max-h-9 w-full object-contain sm:col-start-2 lg:col-span-1"
              src="/logos/formbricks.png"
              alt="Formbricks"
          />
          <img
            className="col-span-2 col-start-2 max-h-10 w-full object-contain sm:col-start-auto lg:col-span-1"
            src="/logos/jacobs.png"
            alt="Jacobs"
          />
        </div>
      </div>
    </div>
  );
}
