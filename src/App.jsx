import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import AddItemModal from "./components/AddItemModal";



export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("marketplace");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        navigate("/login");
        return;
      }
      setUser(session.session.user);
      fetchItems(session.session.user);
    }
    init();
  }, []);

  const fetchItems = async (currentUser) => {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return console.error(error);

    setItems(data);
    setMyItems(data.filter((i) => i.owner_id === currentUser.id));
    fetchLeaderboard();
    fetchRequests(data, currentUser);
    setLoading(false);
  };

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from("leaderboard")
      .select("*")
      .order("points", { ascending: false });
    setLeaders(data || []);
  };

  const fetchRequests = async (allItems, currentUser) => {
    const { data: myReqs } = await supabase
      .from("requests")
      .select("id, status, item_id, buyer_id, items!inner(id,title,price,owner_id)")
      .eq("buyer_id", currentUser.id);

    const { data: incoming } = await supabase
      .from("requests")
      .select("id, status, buyer_id, item_id, items!inner(id,title,price,owner_id)")
      .in(
        "item_id",
        allItems.filter((i) => i.owner_id === currentUser.id).map((i) => i.id)
      );

    setMyRequests(myReqs || []);
    setIncomingRequests(incoming || []);
  };

  const handleRequestToBuy = async (itemId) => {
    const { error } = await supabase
      .from("requests")
      .insert([{ buyer_id: user.id, item_id: itemId, status: "pending" }]);
    if (error) return alert("Error: " + error.message);
    alert("Request sent to owner!");
    await supabase.rpc("increment_points", { uid: user.id, pts: 5 });
    fetchLeaderboard();
  };

  const updateRequestStatus = async (id, status) => {
    const { error } = await supabase
      .from("requests")
      .update({ status })
      .eq("id", id);
    if (error) return alert(error.message);
    alert("Request " + status);
    fetchItems(user);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await supabase.from("items").delete().eq("id", id);
    fetchItems(user);
  };

  const handleEdit = async (id) => {
    const newPrice = prompt("Enter new price:");
    if (!newPrice) return;
    await supabase.from("items").update({ price: newPrice }).eq("id", id);
    fetchItems(user);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading)
    return <div style={{ textAlign: "center", marginTop: "40vh" }}>Loading...</div>;

  const renderItems = (data, isMine = false) => (
    <div style={grid}>
      {data.map((item) => (
        <div key={item.id} style={card}>
          <h4 style={cardTitle}>{item.title}</h4>
          <p style={sub}>{item.category}</p>
          {item.price && <p>₹{item.price}</p>}
          <p style={desc}>{item.description}</p>
          {isMine ? (
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={greyBtn} onClick={() => handleEdit(item.id)}>
                ✏️ Edit
              </button>
              <button style={redBtn} onClick={() => handleDelete(item.id)}>
                🗑 Delete
              </button>
            </div>
          ) : (
            <button style={greenBtn} onClick={() => handleRequestToBuy(item.id)}>
              🤝 Request to Buy
            </button>
          )}
        </div>
      ))}
      {data.length === 0 && (
        <p style={{ color: "#555" }}>No items available right now.</p>
      )}
    </div>
  );

  return (
    <div style={page}>
      {/* NAV */}
      <nav style={nav}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/campus-logo.png" alt="logo" style={{ width: 40 }} />
          <h1 style={{ color: "#2C2C2C" }}>Campus Xchange</h1>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <button style={navBtn} onClick={() => setActiveTab("marketplace")}>
            Marketplace
          </button>
          <button style={navBtn} onClick={() => setActiveTab("myitems")}>
            My Items
          </button>
          <button style={navBtn} onClick={() => setActiveTab("requests")}>
            My Requests
          </button>
          <button style={{ ...navBtn, color: "#E74C3C" }} onClick={handleSignOut}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: "30px 60px" }}>
        {activeTab === "marketplace" && (
          <>
            <h2 style={heading}>Marketplace</h2>
            {renderItems(items)}
            <h3 style={heading}>Leaderboard 🏆</h3>
            {leaders.map((l, i) => (
              <p key={l.user_id}>
                {i + 1}. {l.username || l.user_id.slice(0, 6)} — {l.points} pts
              </p>
            ))}
          </>
        )}

        {activeTab === "myitems" && (
          <>
            <h2 style={heading}>My Items</h2>
            {renderItems(myItems, true)}
          </>
        )}

        {activeTab === "requests" && (
          <>
            <h2 style={heading}>My Requests</h2>
            {myRequests.map((r) => (
              <div key={r.id} style={card}>
                <h4>{r.items?.title}</h4>
                <p>Status: {r.status}</p>
              </div>
            ))}
            <h2 style={heading}>Incoming Requests</h2>
            {incomingRequests.map((r) => (
              <div key={r.id} style={card}>
                <h4>{r.items?.title}</h4>
                <p>Buyer: {r.buyer_id.slice(0, 6)}...</p>
                <p>Status: {r.status}</p>
                {r.status === "pending" && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      style={greenBtn}
                      onClick={() => updateRequestStatus(r.id, "accepted")}
                    >
                      ✅ Accept
                    </button>
                    <button
                      style={redBtn}
                      onClick={() => updateRequestStatus(r.id, "rejected")}
                    >
                      ❌ Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <button style={greenBtn} onClick={() => setShowModal(true)}>
            + Add Item
          </button>
        </div>
        {showModal && (
          <AddItemModal
            user={user}
            onClose={() => setShowModal(false)}
            onItemAdded={() => fetchItems(user)}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */
const beige = "#F8F3E7";
const darkGrey = "#2C2C2C";
const green = "#2DBE60";
const red = "#E74C3C";
const lightGrey = "#FFFFFF";

const page = {
  backgroundColor: beige,
  minHeight: "100vh",
  color: darkGrey,
  fontFamily: "Poppins, sans-serif",
};

const nav = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 40px",
  backgroundColor: lightGrey,
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const navBtn = {
  background: "none",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
  color: darkGrey,
  fontWeight: 500,
};

const heading = {
  borderLeft: `4px solid ${green}`,
  paddingLeft: 10,
  margin: "30px 0 15px 0",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "20px",
};

const card = {
  backgroundColor: lightGrey,
  borderRadius: "12px",
  padding: "15px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

const cardTitle = { marginBottom: 5, fontWeight: 600 };
const sub = { color: "#777", fontSize: 13 };
const desc = { color: "#555", fontSize: 14 };
const greenBtn = {
  backgroundColor: green,
  border: "none",
  color: "#fff",
  padding: "8px 12px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};
const redBtn = { ...greenBtn, backgroundColor: red };
const greyBtn = { ...greenBtn, backgroundColor: "#666" };
