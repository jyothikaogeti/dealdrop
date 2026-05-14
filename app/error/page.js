import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="bg-white text-center rounded-lg shadow-lg max-w-md w-full p-8">
        <h1 className="text-2xl text-red-600 font-bold mb-4">
          Authentication Error
        </h1>

        <p className="text-gray-600 mb-6">
          Sorry, There was an error during authentication. Please try again.
        </p>

        <Link
          href="/"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition px-6 py-2"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
