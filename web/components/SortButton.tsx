import React from "react";
import Image from "next/image";

interface SortButtonProps {
  sortOrder: "latest" | "oldest";
  toggleSortOrder: () => void;
}

const SortButton: React.FC<SortButtonProps> = ({
  sortOrder,
  toggleSortOrder,
}) => {
  return (
    <button
      onClick={toggleSortOrder}
      className="text-sm text-slate-gray hover:text-midnight-blue focus:outline-none flex items-center"
    >
      Sorted by {sortOrder === "latest" ? "Latest" : "Oldest"}
      <Image
        src="/arrow-down-wide-narrow.svg"
        alt="Sort Icon"
        width={16}
        height={16}
        className={`ml-1 transition-transform duration-200 ${
          sortOrder === "latest" ? "" : "rotate-180"
        }`}
      />
    </button>
  );
};

export default SortButton;
