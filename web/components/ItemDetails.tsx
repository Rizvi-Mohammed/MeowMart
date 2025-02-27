interface ItemDetailsProps {
  item: Cat;
  currentUser?: string | null;
}

export default function ItemDetails({ item, currentUser }: ItemDetailsProps) {
  const isCurrentBidder = currentUser === item.currentBidder;

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center text-slate-gray">
          <span>Breed</span>
          <span className="text-midnight-blue font-medium">
            {item.catBreed}
          </span>
        </div>

        <div className="flex justify-between items-center text-slate-gray">
          <span>Age</span>
          <span className="text-midnight-blue font-medium">
            {item.age} {item.age === 1 ? "year" : "years"}
          </span>
        </div>

        <div className="flex justify-between items-center text-slate-gray">
          <span>Auction Type</span>
          <span className="text-midnight-blue font-medium capitalize bg-sage-green/10 px-3 py-1 rounded-full text-sm">
            {item.auctionType || "Standard"}
          </span>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center text-slate-gray">
          <span>Starting Price</span>
          <span className="text-midnight-blue font-medium">
            ${item.startingPrice.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center text-slate-gray">
          <span>Reserve Price</span>
          <span className="text-midnight-blue font-medium">
            ${item.reservePrice.toLocaleString()}
          </span>
        </div>

        {item.currentBid && (
          <div className="flex justify-between items-center text-slate-gray">
            <span>Current Bid</span>
            <span className="text-sunset-orange font-semibold text-xl">
              ${item.currentBid.toLocaleString()}
            </span>
          </div>
        )}

        {item.currentBidder && (
          <div className="flex justify-between items-center text-slate-gray">
            <span>Current Bidder</span>
            <span
              className={`font-medium px-3 py-1 rounded-full text-sm ${
                isCurrentBidder
                  ? "bg-sunset-orange/10 text-sunset-orange"
                  : "bg-sage-green/10 text-midnight-blue"
              }`}
            >
              {item.currentBidder}
              {isCurrentBidder && " (You)"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
