"use client";

import { useState } from "react";

interface ItemsSearchBarProps {
  onSearch: (searchTerm: string) => void;
  onFilter: (filterType: string) => void;
}

export default function ItemsSearchBar({
  onSearch,
  onFilter,
}: ItemsSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setFilterType(type);
    onFilter(type);
  };

  return (
    <div className="mb-6 flex space-x-4">
      <input
        type="text"
        placeholder="Search cats by name..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-midnight-blue"
      />
      <select
        value={filterType}
        onChange={handleFilterChange}
        className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-midnight-blue"
      >
        <option value="">All Auction Types</option>
        <option value="forward">Forward Auction</option>
        <option value="dutch">Dutch Auction</option>
      </select>
    </div>
  );
}
