export default function Team({resource}) {
  return (
    <div id="about" className="bg-orange-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="mt-2 text-3xl font-cal text-orange-900 sm:text-5xl">
            {resource["About"]}
          </h2>
        </div>
        <div className="flex mt-6 text-gray-700">
          <div className="w-1/2 mr-8">
            {resource["BroughtToYouBy"]}
            <br />
            <br />
            {resource["WouldNotBePossible"]}
          </div>
          <div className="w-1/2 ml-8">
            {resource["ReachOut"]}
            <br />
            <br />
            jc2897@cornell.edu
            <br />
            +1 646-793-1309
            <br />
            Cornell LLM Engineering Club
            <br />
            @jcllobet
          </div>
        </div>
      </div>
    </div>
  );
}
