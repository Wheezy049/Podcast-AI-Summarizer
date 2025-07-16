import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center bg-white p-10 rounded-lg">
      <h1 className="text-6xl font-bold">Not Found</h1>
      <p className="text-xl text-gray-700 mt-4">
        Could not find the requested resource
      </p>
      <Link
        href="/"
        className="mt-6 inline-block px-6 py-3 bg-orange-500 text-white font-semibold text-lg rounded-lg hover:bg-orange-600 transition duration-300"
      >
        Return Home
      </Link>
    </div>
  );
}
