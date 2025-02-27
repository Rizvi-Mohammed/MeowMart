import React from "react";

interface Bid {
  bidder: string;
  amount: number;
  timestamp: string;
}

interface BidItemProps {
  bid: Bid;
  currentUser: string | null;
}

const BidItem: React.FC<BidItemProps> = ({ bid, currentUser }) => {
  const isSystem = bid.bidder.toLowerCase() === "system";
  const isWinnerMessage = bid.bidder.includes("Winner:");

  if (isWinnerMessage) {
    const parts = bid.bidder.split(/Winner: | with bid: /);
    const winnerName = parts[1];
    const bidAmount = parts[2];

    return (
      <div className="flex justify-center items-center py-4 border-b border-sage-green/10 last:border-0">
        <div className="bg-cloud-white p-6 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center mb-2">
            <div className="text-midnight-blue font-medium text-base">
              Auction Ended
            </div>
          </div>
          <div className="text-center">
            <div className="text-sunset-orange font-bold text-2xl mb-1">
              {winnerName}
            </div>
            <div className="text-midnight-blue max-sm:text-sm">
              won with a bid of
              <span className="font-bold ml-1">${bidAmount}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center py-2 border-b border-sage-green/10 last:border-0">
      <div>
        <span
          className={`font-medium ${
            bid.bidder === currentUser
              ? "text-sunset-orange"
              : isSystem
              ? "text-slate-gray"
              : "text-midnight-blue"
          }`}
        >
          {isSystem
            ? "Price Dropped"
            : `${bid.bidder}${bid.bidder === currentUser ? " (You)" : ""}`}
        </span>
        <p className="text-sm text-slate-gray">
          {new Date(bid.timestamp).toLocaleString()}
        </p>
      </div>
      <span className="font-semibold text-midnight-blue">
        $
        {bid.amount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </div>
  );
};

export default BidItem;
