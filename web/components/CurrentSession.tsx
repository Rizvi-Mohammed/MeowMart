import Link from "next/link";

interface CurrentSessionProps {
  currentUser: string;
  handleLogout: () => void;
}

export default function CurrentSession({
  currentUser,
  handleLogout,
}: CurrentSessionProps) {
  const getAvatar = (name: string | null) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="h-full bg-cloud-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 border border-slate-gray/20 text-center">
        <div className="rounded-full mx-auto size-12 bg-orange-400 flex items-center justify-center text-cloud-white text-2xl font-bold mb-4">
          {getAvatar(currentUser)}
        </div>
        <h1 className="text-3xl mb-4 font-bold text-midnight-blue">
          Welcome, {currentUser}
        </h1>

        <p className="text-slate-gray mb-2">You are currently logged in.</p>
        <p className="text-slate-gray text-sm mb-6">
          Account settings are unavailable at this moment with no future plans
          on ever being implemented.
        </p>

        <Link
          href="/"
          className="w-full mb-2 inline-block bg-sunset-orange text-white py-2 rounded-md hover:bg-sunset-orange/90 transition-colors duration-300"
        >
          Back to Home
        </Link>
        <button
          onClick={handleLogout}
          className="w-full bg-midnight-blue text-white py-2 rounded-md hover:bg-midnight-blue/90 transition-colors duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
