import { useState, useEffect } from "react";

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const usernameCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("username=")
    );
    if (usernameCookie) {
      const username = usernameCookie.split("=")[1];
      setCurrentUser(decodeURIComponent(username));
    }
  }, []);

  return currentUser;
}
