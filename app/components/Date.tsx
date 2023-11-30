export default function Date({resource}) {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-8">
        <h3 className="font-cal text-5xl text-orange-100">
          {resource["HackDate1"]}
        </h3>
        <p className="mt-4 font-light text-orange-300">
          {resource["HackDate2"]}
          <br />
          {resource["AwardDate"]}
        </p>
      </div>
    </div>
  );
}
