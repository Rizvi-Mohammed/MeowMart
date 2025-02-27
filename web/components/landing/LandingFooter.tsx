import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="text-slate-grey border-t py-12 px-4">
      <div className="container mx-auto grid md:grid-cols-3 gap-8">
        <div className="flex flex-col items-start">
          <div className="text-2xl font-bold flex items-center gap-2 mb-4">
            <span>🐱</span>
            <span>MeowMart</span>
          </div>
          <p className="text-slate-grey/80">
            Your dream cat is just a bid away — Meow-velous!
          </p>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <Link
            href="/adopt"
            className="hover:text-sage-green transition-colors"
          >
            Adopt a Cat
          </Link>
          <Link
            href="/how-it-works"
            className="hover:text-sage-green transition-colors"
          >
            How Auctions Work
          </Link>
          <Link
            href="/leaderboard"
            className="hover:text-sage-green transition-colors"
          >
            Cat Collectors&apos; Leaderboard
          </Link>
          <Link
            href="/contact"
            className="hover:text-sage-green transition-colors"
          >
            Contact
          </Link>
        </div>
        <div className="flex flex-col items-end">
          <div className="w-full max-w-xs">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded bg-white/10 border border-sage-green mb-2"
            />
            <button className="w-full bg-sunset-orange text-cloud-white py-2 rounded hover:bg-opacity-90 transition-all hover:translate-y-1">
              Join the Cat Community
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
