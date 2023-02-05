export default function Page403(){
  return (
    <div className="mx-auto max-w-xl py-16 sm:py-24">
      <div className="text-center">
        <p className="text-base font-semibold text-sky-600">403</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-800">
          Uh oh! I think you're Forbidden.
        </h1>
        <p className="mt-2 text-lg text-gray-500">It looks like you don't have enough permission to access this page. <br /> Ask Lab manager if you have a right to access this data.</p>
      </div>
    </div>
  );
};