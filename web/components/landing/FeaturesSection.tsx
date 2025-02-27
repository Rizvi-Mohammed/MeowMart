import Image from "next/image";

export default function FeaturesSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-sage-green text-center mb-12">
          Choose Your Purr-fect Auction Style 🎯
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-cloud-white p-6 rounded-lg shadow hover:shadow-lg transition-all hover:scale-105 hover:rotate-1">
            <h3 className="text-2xl font-bold text-sage-green mb-2">
              Forward Auction: Outbid for Your Purrfect Match!
            </h3>
            <p className="text-slate-grey mb-6">
              Bid on cats like Captain Whiskers and Sir Meowington. May the best
              bidder win!
            </p>
            <div className="h-48 overflow-hidden relative w-full bg-gray-300 rounded flex items-center justify-center text-gray-500">
              <Image
                src="https://images.pexels.com/photos/2558605/pexels-photo-2558605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Cat"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="bg-cloud-white p-6 rounded-lg shadow hover:shadow-lg transition-all hover:scale-105 hover:-rotate-1">
            <h3 className="text-2xl font-bold text-sage-green mb-2">
              Dutch Auction: Catch the Deal Before It&apos;s Gone!
            </h3>
            <p className="text-slate-grey mb-6">
              The price drops every second. Will you wait or pounce?
            </p>
            <div className="h-48 overflow-hidden relative w-full bg-gray-300 rounded flex items-center justify-center text-gray-500">
              <Image
                src="https://images.pexels.com/photos/2541239/pexels-photo-2541239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Cat"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
