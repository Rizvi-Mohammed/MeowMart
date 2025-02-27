import type { Metadata } from "next";
import { Baloo_2 } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "MeowMart - Online Cat Auction Platform",
  description:
    "The purr-fect destination for bidding on unique and quirky cats. Join our feline-loving community and start bidding today!",
};

const baloo2 = Baloo_2({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn("bg-cloud-white flex antialiased", baloo2.className)}>
        {children}
      </body>
    </html>
  );
}
