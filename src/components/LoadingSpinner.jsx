import React from "react";

export default function LoadingSpinner() {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <h3 style={styles.text}>Campus Xchange</h3>
      <p style={styles.sub}>Loading your marketplace...</p>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100%",
    backgroundColor: "#F8F3E7",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#2C2C2C",
    fontFamily: "Poppins, sans-serif",
  },
  spinner: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "5px solid #ddd",
    borderTopColor: "#2DBE60",
    animation: "spin 1s linear infinite",
  },
  text: {
    marginTop: "20px",
    fontSize: "20px",
    fontWeight: 600,
  },
  sub: {
    color: "#555",
    fontSize: "14px",
    marginTop: "4px",
  },
};

// Inline CSS animation
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(styleSheet);
