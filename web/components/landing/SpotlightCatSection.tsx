import Image from "next/image";

export default function SpotlightCatSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-slate-grey/10 to-slate-grey/20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-sage-green text-center mb-12">
          Spotlight Cat of the Day! ⭐
        </h2>
        <div className="max-w-4xl mx-auto group bg-white rounded-lg p-8 shadow-lg flex flex-col md:flex-row items-center gap-8">
          <div className="h-48 group-hover:shadow-2xl duration-1000 shadow-md transition-shadow shadow-midnight-black/50 relative overflow-hidden w-48 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
            <Image
              src="https://images.pexels.com/photos/9718154/pexels-photo-9718154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Cat"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-[1.75] [transform-origin:_75%_25%] transition-transform [transition-duration:1500ms;]"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-sage-green mb-2">
              Lord Fluffington III
            </h3>
            <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
              <span className="bg-sage-green text-cloud-white px-3 py-1 rounded-full text-sm">
                Ultra Rare
              </span>
              <span className="bg-sage-green text-cloud-white px-3 py-1 rounded-full text-sm">
                Royal Lineage
              </span>
              <span className="bg-sage-green text-cloud-white px-3 py-1 rounded-full text-sm">
                Majestic
              </span>
            </div>
            <p className="text-slate-grey mb-4">
              A distinguished gentleman with a taste for luxury and afternoon
              naps.
            </p>
            <p className="text-sunset-orange font-bold mb-4">
              Auction ends in: 2 hours, 30 minutes
            </p>
            <button className="bg-sunset-orange text-cloud-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all hover:translate-y-1">
              Place Your Bid Now!
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
