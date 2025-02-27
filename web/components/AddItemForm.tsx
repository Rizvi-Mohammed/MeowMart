"use client";

import { useState } from "react";

const AddItemForm = () => {
  const [itemName, setItemName] = useState("");
  const [auctionType, setAuctionType] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [reservePrice, setReservePrice] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8081/Bidding/ItemServlet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            itemName,
            auctionType,
            startingPrice: parseFloat(startingPrice),
            reservePrice: parseFloat(reservePrice),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Item added successfully!");
      } else {
        setMessage(data.message || "Failed to add item.");
      }
    } catch (error) {
      if (error instanceof Error && error.message) {
        setMessage("Error adding item: " + error.message);
      } else {
        setMessage("An error occurred while adding the item.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Item Name:</label>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Auction Type:</label>
        <input
          type="text"
          value={auctionType}
          onChange={(e) => setAuctionType(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Starting Price:</label>
        <input
          type="number"
          value={startingPrice}
          onChange={(e) => setStartingPrice(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Reserve Price:</label>
        <input
          type="number"
          value={reservePrice}
          onChange={(e) => setReservePrice(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Item</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default AddItemForm;
