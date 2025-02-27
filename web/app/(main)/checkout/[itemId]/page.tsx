import CheckoutForm from "@/components/CheckoutForm";
import { notFound } from "next/navigation";

async function getItem(itemId: string): Promise<Cat | null> {
  try {
    const res = await fetch(`http://localhost:8081/Bidding/ItemServlet`, {
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

const CheckoutPage = async ({ params }: Props) => {
  const { itemId } = await params; // Await the params Promise

  if (!itemId) {
    return notFound();
  }

  const item = await getItem(itemId);

  if (!item) {
    return notFound();
  }

  return (
    <div className="bg-black h-[calc(100svh-80px)] overflow-y-auto">
      <CheckoutForm item={item} />
    </div>
  );
};

export default CheckoutPage;
