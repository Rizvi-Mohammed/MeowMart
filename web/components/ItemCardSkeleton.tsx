import React from "react";

const ItemCardSkeleton = () => {
  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-4 md:p-8 animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
      <hr />
      <div className="h-4 bg-gray-300 rounded w-1/2 my-2"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 my-2"></div>
      <div className="h-8 bg-gray-300 ml-auto rounded-md mt-4 w-1/3"></div>
    </div>
  );
};

export default ItemCardSkeleton;
