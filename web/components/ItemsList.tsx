"use client";

import { useEffect, useState } from "react";
import ItemCard from "./ItemCard";
import ItemCardSkeleton from "./ItemCardSkeleton";
import ItemsSearchBar from "./ItemsSearchBar";
import ErrorDisplay from "./ErrorDisplay";
import ItemsHeader from "./ItemsHeader";

interface Cat {
  itemId: number;
  itemName: string;
  auctionType: "forward" | "dutch";
  startingPrice: number;
  reservePrice: number;
  catBreed: string;
  age: number;
  username?: string;
  currentBid?: number;
  currentBidder?: string;
}

interface ItemsListProps {
  currentUser: string | null;
}

export default function ItemsList({
  currentUser: initialCurrentUser,
}: ItemsListProps) {
  const [cats, setCats] = useState<Cat[]>([]);
  const [filteredCats, setFilteredCats] = useState<Cat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(
    initialCurrentUser
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    // Check for username cookie
    const cookies = document.cookie.split(";");
    const usernameCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("username=")
    );

    if (usernameCookie) {
      const username = usernameCookie.split("=")[1];
      setCurrentUser(decodeURIComponent(username));
    }

    // Fetch cats from the server
    fetch("http://localhost:8081/Bidding/ItemServlet")
      .then((response) => {
        if (!response.ok) {
          console.error(`Error: ${response.status} ${response.statusText}`);
          throw new Error("Failed to fetch cats");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data", data);

        setCats(data);
        setFilteredCats(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cats:", error.message, error.stack);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterCats(term, filterType);
  };

  const handleFilter = (type: string) => {
    setFilterType(type);
    filterCats(searchTerm, type);
  };

  const filterCats = (term: string, type: string) => {
    let filtered = cats;

    if (term) {
      const lowercasedTerm = term.toLowerCase().trim();
      filtered = filtered.filter(
        (cat) =>
          cat.itemName.toLowerCase().includes(lowercasedTerm) ||
          cat.catBreed.toLowerCase().includes(lowercasedTerm) // Search by breed too
      );
    }

    if (type) {
      filtered = filtered.filter((cat) => cat.auctionType === type);
    }

    setFilteredCats(filtered);
  };

  if (isLoading) {
    return (
      <div className="bg-cloud-white p-8">
        <div className="max-w-7xl w-full mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-sage-green animate-pulse">
              Loading Auctions...
            </h1>
            <p className="text-slate-grey animate-pulse">
              Fetching the latest cat auctions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, index) => (
              <ItemCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="bg-cloud-white md:p-4 xl:p-8">
      <div className="max-w-7xl w-full mx-auto space-y-8">
        <ItemsHeader itemCount={filteredCats.length} />

        <ItemsSearchBar onSearch={handleSearch} onFilter={handleFilter} />

        {filteredCats.length === 0 ? (
          <div className="text-center text-slate-grey">
            No cats found. Try a different search term or filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCats.map((cat) => (
              <ItemCard key={cat.itemId} item={cat} currentUser={currentUser} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
