import ItemsList from "@/components/ItemsList";

export default function ItemsPage() {
  // Check for username cookie
  const cookies =
    (typeof document !== "undefined" && document.cookie.split(";")) || [];
  const usernameCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("username=")
  );

  let currentUser = null;
  if (usernameCookie) {
    const username = usernameCookie.split("=")[1];
    currentUser = decodeURIComponent(username);
  }

  return <ItemsList currentUser={currentUser} />;
}
