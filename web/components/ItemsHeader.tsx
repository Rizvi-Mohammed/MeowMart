"use client";

interface ItemsHeaderProps {
  itemCount: number;
}

export default function ItemsHeader({ itemCount }: ItemsHeaderProps) {
  return (
    <div className="text-center space-y-2 mb-6">
      <h1 className="text-4xl font-bold text-sage-green flex items-center justify-center gap-2">
        <span>Available Cats for Auction</span>
        <span>🐈‍⬛</span>
      </h1>
      <p className="text-slate-grey">
        Browse and bid on {itemCount} exclusive cats
      </p>
    </div>
  );
}
