import Image from "next/image";

export default function FeaturedListingsSection() {
  const cats = [
    {
      name: "Mr. Whiskerstein",
      traits: ["Rare", "Intellectual", "Dapper"],
      src: "https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "Princess Pawsy",
      traits: ["Uncommon", "Playful", "Elegant"],
      src: "https://images.pexels.com/photos/16229760/pexels-photo-16229760/free-photo-of-a-cat-is-walking-through-the-grass-in-the-middle-of-the-woods.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "Sir Meow-a-lot",
      traits: ["Legendary", "Adventurous", "Noble"],
      src: "https://images.pexels.com/photos/18446936/pexels-photo-18446936/free-photo-of-close-up-photo-of-a-black-short-haired-kitten-lying-on-a-bed.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-sage-green text-center mb-12">
          Meet the Cats! 😺
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cats.map((cat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-all hover:scale-105"
            >
              <div className="h-40 relative overflow-hidden w-full bg-gray-300 rounded mb-4 flex items-center justify-center text-gray-500">
                <Image
                  src={cat.src}
                  alt="Cat"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-sage-green mb-2">
                {cat.name}
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {cat.traits.map((trait, i) => (
                  <span
                    key={i}
                    className="bg-sage-green text-cloud-white px-2 py-1 rounded-full text-xs"
                  >
                    {trait}
                  </span>
                ))}
              </div>
              <p className="text-sunset-orange font-bold mb-4">
                Current Bid: 1,000 Coins
              </p>
              <button className="w-full bg-sunset-orange text-cloud-white py-2 rounded hover:bg-opacity-90 transition-all hover:translate-y-1">
                Place Bid
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
