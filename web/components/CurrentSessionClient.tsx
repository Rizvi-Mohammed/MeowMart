"use client";

import CurrentSession from "./CurrentSession";
import { useRouter } from "next/navigation";

interface CurrentSessionClientProps {
  currentUser: string;
}

export default function CurrentSessionClient({
  currentUser,
}: CurrentSessionClientProps) {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie =
      "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.refresh();
  };

  return (
    <CurrentSession currentUser={currentUser} handleLogout={handleLogout} />
  );
}
