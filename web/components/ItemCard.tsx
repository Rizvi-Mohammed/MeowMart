"use client";

import Image from "next/image";
import Link from "next/link";

interface Cat {
  itemId: number;
  itemName: string;
  auctionType: "forward" | "dutch";
  startingPrice: number;
  reservePrice: number;
  catBreed: string;
  age: number;
  username?: string;
  currentBid?: number;
  currentBidder?: string;
}

interface ItemCardProps {
  item: Cat;
  currentUser: string | null;
}

export default function ItemCard({ item, currentUser }: ItemCardProps) {
  const isCurrentBidder = currentUser === item.currentBidder;

  return (
    <Link
      href={`/item/${item.itemId}`}
      className="block bg-cloud-white group rounded-lg shadow-md p-6 space-y-5 border border-sage-green/20 
                hover:border-sage-green/40 transition-all duration-200 hover:shadow-lg 
                transform hover:-translate-y-1"
    >
      <div className="flex justify-between gap-2 items-center border-b pb-3 border-sage-green/20">
        <h2 className="text-2xl truncate font-semibold text-sage-green">
          {item.itemName}
        </h2>
        <Image
          src="/cat-laying.webp"
          alt="Cat laying down"
          width={32}
          height={32}
          className="group-hover:rotate-[720deg] ease-out transition-transform [transition-duration:3000ms]"
        />
      </div>

      <div className="space-y-3">
        <p className="flex justify-between items-center text-slate-grey">
          Auction Type
          <span className="text-sage-green font-medium capitalize bg-sage-green/10 px-3 py-1 rounded-full text-sm">
            {item.auctionType}
          </span>
        </p>
        <p className="flex justify-between items-center text-slate-grey">
          Breed
          <span className="text-sage-green font-medium capitalize bg-sage-green/10 px-3 py-1 rounded-full text-sm">
            {item.catBreed}
          </span>
        </p>
        <p className="flex justify-between items-center text-slate-grey">
          Age
          <span className="text-sage-green font-medium capitalize bg-sage-green/10 px-3 py-1 rounded-full text-sm">
            {item.age}
          </span>
        </p>
        <p className="flex justify-between items-center text-slate-grey">
          Starting Price
          <span className="text-sage-green font-medium">
            ${item.startingPrice.toLocaleString()}
          </span>
        </p>
        {item.currentBid && (
          <p className="flex justify-between items-center text-slate-grey">
            Current Bid
            <span className="text-sunset-orange font-semibold text-lg">
              ${item.currentBid.toLocaleString()}
            </span>
          </p>
        )}
        {item.currentBidder && (
          <p className="flex justify-between items-center text-slate-grey">
            Current Bidder
            <span
              className={`font-medium px-3 py-1 rounded-full text-sm ${
                isCurrentBidder
                  ? "bg-sunset-orange/10 text-sunset-orange"
                  : "bg-sage-green/10 text-sage-green"
              }`}
            >
              {item.currentBidder}
              {isCurrentBidder && " (You)"}
            </span>
          </p>
        )}
      </div>

      <div className="pt-2 text-right">
        <span className="text-sage-green hover:text-sunset-orange transition-colors duration-300 text-sm font-medium">
          View Details →
        </span>
      </div>
    </Link>
  );
}
