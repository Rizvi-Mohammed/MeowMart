import React, { useState } from "react";
import BidItem from "./BidItem";
import SortButton from "./SortButton";

interface Bid {
  bidder: string;
  amount: number;
  timestamp: string;
}

interface BidHistoryProps {
  bidHistory: Bid[];
  currentUser: string | null;
}

const BidHistory: React.FC<BidHistoryProps> = ({ bidHistory, currentUser }) => {
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  const sortedBidHistory = [...bidHistory].sort((a, b) => {
    if (sortOrder === "latest") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "latest" ? "oldest" : "latest");
  };

  return (
    <div className="bg-sage-green/5 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-midnight-blue">
          Bid History
        </h2>
        <SortButton sortOrder={sortOrder} toggleSortOrder={toggleSortOrder} />
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {sortedBidHistory.length === 0 ? (
          <p className="text-slate-gray py-4">No bids placed yet</p>
        ) : (
          sortedBidHistory.map((bid, index) => (
            <BidItem key={index} bid={bid} currentUser={currentUser} />
          ))
        )}
      </div>
    </div>
  );
};

export default BidHistory;
