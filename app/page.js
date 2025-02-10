import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold text-primary">Hungry-Bite</h1>
      <p className="text-lg text-gray-700 mt-4">Save food. Feed people. Reduce waste.</p>
      <div className="mt-6">
        {/* <Link href="/restaurants"> */}
          <button className="px-6 py-3 bg-secondary text-white rounded-xl hover:bg-green-700 transition">
            Browse Restaurants
          </button>
        {/* </Link> */}
      </div>
    </div>
  );
}
