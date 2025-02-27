import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cloud-white w-full flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border-2 border-sage-green/20 relative overflow-hidden">
        {/* Playful Paw Print Background */}
        <div className="absolute -top-10 -right-10 opacity-10 select-none">
          <span className="text-[200px] text-sage-green">🐾</span>
        </div>

        {/* Cat Illustration Section */}
        <div className="mb-6 flex justify-center">
          <div className="bg-sunset-orange/10 rounded-full p-4">
            <span className="text-[80px]">🐱</span>
          </div>
        </div>

        {/* Main Content */}
        <h2 className="text-3xl font-bold text-midnight-blue mb-4 flex items-center justify-center gap-2">
          Oops! Page Not Found <span className="animate-bounce">🙀</span>
        </h2>

        <p className="text-slate-gray mb-6">
          The page you&apos;re looking for seems to have wandered off like a
          curious cat. Maybe it&apos;s exploring behind the couch or chasing a
          laser pointer! 🐾
        </p>

        {/* Return Home Button */}
        <Link
          href="/"
          className="
            inline-flex items-center gap-2 
            bg-sage-green text-white 
            px-6 py-3 rounded-full 
            hover:bg-sage-green/90 
            transition-colors duration-300 
            shadow-md hover:shadow-lg
            group
          "
        >
          <span className="mr-2">🏠</span>
          Return to MeowMart
        </Link>

        {/* Playful Yarn Ball Accent */}
        <div className="absolute -bottom-10 -left-10 opacity-10 select-none">
          <span className="text-[200px] text-sage-green">🧶</span>
        </div>
      </div>
    </div>
  );
}
