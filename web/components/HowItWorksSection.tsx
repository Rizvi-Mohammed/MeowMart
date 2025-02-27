import AuctionTypeCard from "@/components/AuctionTypeCard";
import Link from "next/link";

export default function HowItWorksSection() {
  return (
    <section className="pt-24 pb-16 px-4">
      <div className="container max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-sage-green text-center mb-6">
          How MeowMart Auctions Work
        </h2>
        <div className="space-y-8">
          <AuctionTypeCard
            title="Forward Auction"
            description="In a forward auction, users place bids on a cat, and the highest bidder at the end of the auction wins the cat."
          />
          <AuctionTypeCard
            title="Dutch Auction"
            description="In a Dutch auction, the price of a cat decreases over time. The first user to place a bid at the current price wins the cat."
          />
          <AuctionTypeCard
            title="Bidding"
            description="To participate in auctions, you must first sign up for an account. Once you have an account, you can browse available cats and place bids."
          />
        </div>
        <div className="text-center mt-8">
          <Link
            href="/items"
            className="bg-sunset-orange text-cloud-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all hover:translate-y-1 text-lg flex justify-center items-center gap-2 mx-auto"
          >
            <span>View Available Cats</span>
            <span>🐾</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
