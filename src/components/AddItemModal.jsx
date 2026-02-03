import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function AddItemModal({ user, onClose, onItemAdded }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Books");
  const [type, setType] = useState("resale");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("items").insert([
      {
        owner_id: user.id,
        title,
        category,
        type,
        description,
        image_url: imageUrl,
        price: type === "resale" ? price : null,
      },
    ]);

    setLoading(false);
    if (error) {
      alert("Error adding item: " + error.message);
    } else {
      alert("Item added successfully!");
      onItemAdded(); // refresh dashboard
      onClose(); // close modal
    }
  };

  return (
    <div style={overlay}>
      <div style={modalBox}>
        <h2 style={{ color: "#E50914" }}>Add New Item</h2>
        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Item title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={input}
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)} style={input}>
            <option>Books</option>
            <option>Electronics</option>
            <option>Lab Gear</option>
            <option>Others</option>
          </select>

          <select value={type} onChange={(e) => setType(e.target.value)} style={input}>
            <option value="resale">Resale</option>
            <option value="barter">Barter</option>
            <option value="donation">Donation</option>
          </select>

          {type === "resale" && (
            <input
              type="number"
              placeholder="Price (₹)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={input}
            />
          )}

          <textarea
            placeholder="Short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...input, height: 80 }}
          />

          <input
            type="text"
            placeholder="Image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={input}
          />

          <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between" }}>
            <button
              type="button"
              onClick={onClose}
              style={{ ...btn, background: "#555" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ ...btn, background: "#E50914" }}
            >
              {loading ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 🧱 Styling
const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalBox = {
  background: "#000",
  padding: "25px",
  borderRadius: "8px",
  width: "90%",
  maxWidth: "420px",
  boxShadow: "0 0 20px rgba(0,0,0,0.5)",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "4px",
  border: "none",
  background: "#222",
  color: "#fff",
};

const btn = {
  border: "none",
  color: "#fff",
  padding: "10px 18px",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};
