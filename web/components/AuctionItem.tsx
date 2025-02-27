"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import ItemDetails from "./ItemDetails";
import BidControls from "./BidControls";
import BidHistory from "./BidHistory";
import { useAuctionWebSocket } from "../hooks/useAuctionWebSocket";
import { useCurrentUser } from "../hooks/useCurrentUser";

interface AuctionItemProps {
  item: Cat;
}

export default function AuctionItem({ item: initialItem }: AuctionItemProps) {
  const [item, setItem] = useState(initialItem);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [bidHistory, setBidHistory] = useState<
    Array<{
      bidder: string;
      amount: number;
      timestamp: string;
    }>
  >([]);
  const [auctionStatus, setAuctionStatus] = useState<
    "not_started" | "active" | "ended"
  >("not_started");
  const [forwardAuctionTimer, setForwardAuctionTimer] = useState<number>(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const forwardTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessage = useRef<string | null>(null);

  const currentUser = useCurrentUser();
  const { sendMessage, connectionStatus, data } = useAuctionWebSocket(
    item.itemId.toString()
  );

  // Handle Forward auction timer
  useEffect(() => {
    if (item.auctionType === "forward" && auctionStatus === "active") {
      if (forwardTimerRef.current) {
        clearInterval(forwardTimerRef.current);
      }

      const initialTime =
        data.remainingTime !== undefined ? data.remainingTime : 30;
      setForwardAuctionTimer(initialTime);

      forwardTimerRef.current = setInterval(() => {
        setForwardAuctionTimer((prev) => {
          if (prev <= 0) {
            clearInterval(forwardTimerRef.current!);
            setAuctionStatus("ended");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (forwardTimerRef.current) {
        clearInterval(forwardTimerRef.current);
      }
    };
  }, [
    item.auctionType,
    auctionStatus,
    data.currentBid,
    sendMessage,
    item.currentBid,
    data.remainingTime,
  ]);

  // Update auction status based on WebSocket data
  useEffect(() => {
    if (data.message?.includes("Auction ended")) {
      setAuctionStatus("ended");
      if (timerRef.current) clearInterval(timerRef.current);
      if (forwardTimerRef.current) clearInterval(forwardTimerRef.current);
    } else if (
      (item.auctionType === "forward" &&
        data.currentBidder &&
        data.currentBidder !== "No bids yet") ||
      item.auctionType === "dutch"
    ) {
      setAuctionStatus("active");
    }

    if (data.currentBid !== undefined || data.currentBidder !== undefined) {
      setItem((prevItem) => ({
        ...prevItem,
        currentBid: data.currentBid ?? prevItem.currentBid,
        currentBidder: data.currentBidder ?? prevItem.currentBidder,
        auctionType: data.auctionType ?? prevItem.auctionType,
      }));
    }

    // Handle bid history updates
    if (data.message && data.message !== lastMessage.current) {
      if (item.auctionType === "forward") {
        if (data.message.includes("Winner:")) {
          setBidHistory((prev) => [
            {
              bidder: data.message || "",
              amount: 0,
              timestamp: new Date().toISOString(),
            },
            ...prev,
          ]);
        } else if (
          data.currentBid &&
          data.currentBidder &&
          data.currentBidder !== "No bids yet"
        ) {
          setBidHistory((prev) => [
            {
              bidder: (data.currentBidder ?? "")!,
              amount: data.currentBid!,
              timestamp: new Date().toISOString(),
            },
            ...prev,
          ]);
        }
      }
      lastMessage.current = data.message;
    }
  }, [data, item.auctionType]);

  const placeBid = useCallback(() => {
    if (!currentUser) {
      return;
    }

    // For Dutch auction, use current price as bid amount
    const bidValue =
      item.auctionType === "dutch" ? item.currentBid : parseFloat(bidAmount);

    if (
      item.auctionType === "forward" &&
      (!bidAmount || bidValue === undefined)
    ) {
      return;
    }

    const bidMessage = {
      username: currentUser,
      bidAmount: bidValue,
      auctionType: item.auctionType === "forward" ? "highest" : "dutch",
      bidTime: new Date().toISOString(),
    };

    if (sendMessage(bidMessage)) {
      setBidAmount("");
    }
  }, [bidAmount, currentUser, item.auctionType, item.currentBid, sendMessage]);

  const getStatusMessage = () => {
    if (auctionStatus === "ended") {
      return "Auction has ended";
    }
    if (auctionStatus === "not_started") {
      return "Auction hasn't started yet";
    }
    if (item.auctionType === "dutch" && !!item.currentBid) {
      const priceDropAmount = (item.startingPrice * 0.05).toFixed(2);
      return `Price is going down every 15 seconds (Price will drop by $${priceDropAmount})`;
    }
    return `Auction ends in ${forwardAuctionTimer} seconds`;
  };

  return (
    <div className="bg-cloud-white w-full">
      <h1 className="text-3xl font-bold text-midnight-blue border-b border-sage-green/20 pb-4 mb-6">
        {item.itemName}
      </h1>

      {/* Status Message */}
      <div
        className={`mb-4 p-2 rounded text-center ${
          auctionStatus === "active"
            ? "bg-green-100 text-green-800"
            : auctionStatus === "ended"
            ? "bg-red-100 text-red-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {getStatusMessage()}
      </div>

      <div
        className={`grid ${
          item.auctionType === "dutch"
            ? "grid-cols-1"
            : "grid-cols-1 lg:grid-cols-2"
        } gap-8`}
      >
        {/* Left column: Item details and bid controls */}
        <div className="space-y-6">
          <ItemDetails item={item} currentUser={currentUser} />
          <BidControls
            item={item}
            currentUser={currentUser}
            bidAmount={bidAmount}
            statusMessage={connectionStatus}
            onBidAmountChange={setBidAmount}
            onPlaceBid={placeBid}
            showBidInput={item.auctionType === "forward"}
          />
        </div>

        {/* Right column: Bid history */}
        {item.auctionType === "forward" && (
          <BidHistory bidHistory={bidHistory} currentUser={currentUser} />
        )}
      </div>
    </div>
  );
}
