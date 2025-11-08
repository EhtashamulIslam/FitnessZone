import React from "react";
import PropTypes from "prop-types";

const Cart = ({ items, onRemove }) => {
  if (!items || items.length === 0) {
    return <div style={{ padding: 16, textAlign: "center" }}>Your cart is empty.</div>;
  }

  const total = items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);

  return (
    <div style={{
      padding: 16,
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      maxWidth: 720,
      margin: "0 auto",
      background: "#fff"
    }}>
      <h2 style={{ marginTop: 0 }}>Cart</h2>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map(item => (
          <li key={item.id} style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700 }}>{item.planName}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{item.raw?.planType}</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontWeight: 700 }}>{Number(item.totalPrice).toFixed(2)} {item.currency}</div>
              <button
                onClick={() => onRemove && onRemove(item.id)}
                style={{
                  background: "crimson",
                  color: "#fff",
                  border: "none",
                  padding: "6px 8px",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
                title="Remove"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>

      <hr style={{ border: "none", borderTop: "1px solid #e6e6e6", margin: "12px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 800 }}>
        <div>Total</div>
        <div>{total.toFixed(2)} {items[0]?.currency || "USD"}</div>
      </div>
    </div>
  );
};

Cart.propTypes = {
  items: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default Cart;
