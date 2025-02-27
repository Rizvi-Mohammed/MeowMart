import AuctionItem from "@/components/AuctionItem";
import BackButton from "@/components/BackButton";
import { error } from "console";
import { notFound } from "next/navigation";

async function getItem(itemId: string): Promise<Cat | null> {
  try {
    const res = await fetch(`http://bidding:8081/Bidding/ItemServlet`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch items");
    }

    const items: Cat[] = await res.json();
    const item = items.find((item) => item.itemId === parseInt(itemId));

    if (!item) {
      return null;
    }

    return item;
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
}

interface Props {
  params: Promise<{
    itemId: string;
  }>;
}

export default async function ItemPage({ params }: Props) {
  const { itemId } = await params; // No `await` here; params is synchronous

  const item = await getItem(itemId); // Await the async function

  if (!item) {
    error("Item not found:", itemId);
    return notFound(); // Render 404 if item is not found
  }

  return (
    <div className="max-w-5xl mt-4 mx-auto space-y-8 w-full">
      <BackButton />
      <AuctionItem item={item} />
    </div>
  );
}
