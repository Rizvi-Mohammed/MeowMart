import LoginForm from "@/components/LoginForm";
import { cookies } from "next/headers";
import CurrentSessionClient from "@/components/CurrentSessionClient";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const usernameCookie = cookieStore.get("username");
  const currentUser = usernameCookie
    ? decodeURIComponent(usernameCookie.value)
    : null;

  if (currentUser) {
    return <CurrentSessionClient currentUser={currentUser} />;
  }

  return (
    <div className="min-h-full bg-cloud-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
}
