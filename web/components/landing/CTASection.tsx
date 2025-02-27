import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-slate-grey/10 to-slate-grey/20">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-sage-green mb-4">
          Become the Ultimate Cat Collector!
        </h2>
        <p className="text-xl text-slate-grey mb-8">
          Sign up to start bidding and build your dream cat collection.
        </p>
        <Link
          href="/signup"
          className="bg-sunset-orange w-fit text-cloud-white px-8 py-4 rounded-lg text-xl hover:bg-opacity-90 transition-all hover:translate-y-1 flex items-center gap-2 mx-auto"
        >
          <span>Sign Up to Purr-chase Cats</span>
          <span>🐱</span>
        </Link>
      </div>
    </section>
  );
}
