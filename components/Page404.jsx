export default function Page404(){
  return (
    <div className="mx-auto max-w-xl py-16 sm:py-24">
      <div className="text-center">
        <p className="text-base font-semibold text-sky-600">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-800">
          Uh oh! I think you're lost.
        </h1>
        <p className="mt-2 text-lg text-gray-500">It looks like the page you're looking for doesn't exist or is still under construction. <br /> Contact the service provider, or PLEASE BE PATIENT unless you want to help angry developers!!</p>
      </div>
    </div>
  );
};