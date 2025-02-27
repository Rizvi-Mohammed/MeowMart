import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="pt-24 pb-16 px-4">
      <div className="container max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl font-extrabold text-sage-green">
            Paws, Bid, Win! <br />
            Your Dream Cat Awaits 🐱
          </h1>
          <p className="text-xl text-slate-grey">
            The world&apos;s first auction platform exclusively for bidding on
            tiny cats.
          </p>
          <Link
            href="/items"
            className="bg-sunset-orange w-fit text-cloud-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all hover:translate-y-1 text-lg flex items-center gap-2"
          >
            <span>Start Bidding on Cats!</span>
            <span>🐾</span>
          </Link>
        </div>
        <div className="flex-1 w-full">
          <div className="h-64 overflow-hidden w-full bg-gray-300 flex items-center justify-center text-gray-500 relative text-lg italic rounded-lg">
            <Image
              src="https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg"
              alt="Cat"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
