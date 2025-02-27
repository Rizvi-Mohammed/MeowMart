import React from "react";

interface PurchaseSummaryProps {
  item: {
    itemName: string;
    catBreed: string;
    age: number;
  };
}

const PurchaseSummary: React.FC<PurchaseSummaryProps> = ({ item }) => {
  return (
    <div className="mx-auto w-full bg-gradient-to-br from-sage-green to-emerald-700 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
      <div className="p-6 text-center relative">
        <div className="absolute top-4 left-4 text-white/70">🐾</div>
        <h1 className="text-2xl font-extrabold text-white mb-6 tracking-tight">
          Congratulations!
          <br />
          You Got Cat
        </h1>

        <div className="space-y-4">
          {[
            { label: "Name", value: item.itemName },
            { label: "Breed", value: item.catBreed },
            {
              label: "Age",
              value: `${item.age} ${item.age === 1 ? "year" : "years"} old`,
            },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/10 rounded-xl p-3">
              <p className="text-white/70 text-sm mb-1">{label}</p>
              <p className="text-white font-bold text-lg">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurchaseSummary;
