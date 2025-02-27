import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StatusMessage from "./StatusMessage";

interface BidControlsProps {
  item: Cat;
  currentUser: string | null;
  bidAmount: string;
  statusMessage: {
    message: string;
    type?: "error" | "warning" | "info" | "success";
  };
  onBidAmountChange: (amount: string) => void;
  onPlaceBid: () => void;
  showBidInput?: boolean;
}

export default function BidControls({
  item,
  currentUser,
  bidAmount,
  statusMessage,
  onBidAmountChange,
  onPlaceBid,
  showBidInput = true,
}: BidControlsProps) {
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [winnerUsername, setWinnerUsername] = useState("");
  // const [winnerBidAmount, setWinnerBidAmount] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!statusMessage.message.includes("Auction ended")) {
      return;
    }

    const auctionEndedRegex = /Auction ended! Winner: (.+) with bid: ([\d.]+)/;
    const match = statusMessage.message.match(auctionEndedRegex);

    if (match) {
      setAuctionEnded(true);
      setWinnerUsername(match[1] || "");
      // setWinnerBidAmount(match[2] || "");
    } else {
      setAuctionEnded(false);
      setWinnerUsername("");
      // setWinnerBidAmount("");
    }
  }, [statusMessage.message]);

  if (!currentUser) return null;

  const isDutchAuction = item.auctionType === "dutch";
  const minBidAmount = isDutchAuction
    ? item.currentBid // In Dutch auction, must bid at least the current price
    : item.currentBid
    ? item.currentBid + 1
    : item.startingPrice; // In forward auction, must bid higher than current bid

  const handleCheckout = () => {
    router.push(`/checkout/${item.itemId}`);
  };

  return (
    <div className="space-y-4 pt-6 border-t border-sage-green/20">
      {showBidInput && (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-gray">
            $
          </span>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => onBidAmountChange(e.target.value)}
            placeholder={
              isDutchAuction ? "Enter bid at current price" : "Enter bid amount"
            }
            className="w-full pl-7 pr-3 py-3 border border-sage-green/30 rounded-lg 
                       text-midnight-blue placeholder-slate-gray/70
                       focus:outline-none focus:border-sage-green focus:ring-1 focus:ring-sage-green
                       transition-all duration-300"
            min={minBidAmount}
            step="0.01"
          />
        </div>
      )}

      {statusMessage.message && (
        <StatusMessage
          message={statusMessage.message}
          type={statusMessage.type}
        />
      )}

      <div className="space-y-2">
        {auctionEnded && currentUser === winnerUsername ? (
          <button
            onClick={handleCheckout}
            className="w-full bg-green-500 text-cloud-white py-3 px-6 rounded-lg 
                     font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                     hover:bg-green-600 transition-all duration-300
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Checkout
          </button>
        ) : (
          <button
            onClick={onPlaceBid}
            disabled={statusMessage.message.includes("Auction ended!")}
            className="disabled:opacity-50 disabled:cursor-not-allowed w-full bg-sunset-orange text-cloud-white py-3 px-6 rounded-lg 
                     font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                     hover:bg-sunset-orange/90 transition-all duration-300
                     focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:ring-offset-2"
          >
            {isDutchAuction ? "Buy Now" : "Place Bid"}
          </button>
        )}

        {/* Show different helper text based on auction type */}
        <p className="text-sm text-slate-gray text-center">
          {isDutchAuction
            ? `Current price: $${item.currentBid?.toLocaleString()}`
            : `Minimum bid: $${minBidAmount?.toLocaleString()}`}
        </p>
      </div>
    </div>
  );
}
