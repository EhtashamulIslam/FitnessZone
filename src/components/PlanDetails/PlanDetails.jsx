import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const PlanDetails = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/PricingData.json");
        if (!res.ok) throw new Error(`Failed to fetch JSON (status ${res.status})`);
        const text = await res.text();
        if (text.trim().startsWith("<")) throw new Error("Server returned HTML — check file path or put PricingData.json in public/");
        const json = JSON.parse(text);
        if (!mounted) return;
        setCurrency(json.currency || "USD");
        const found = Array.isArray(json.pricingOptions)
          ? json.pricingOptions.find((p) => String(p.id) === String(id))
          : null;
        if (!found) throw new Error("Plan not found");
        setPlan(found);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 20, color: "#f1f1f1" }}>
        Loading plan details…
      </div>
    );
  if (error)
    return (
      <div style={{ textAlign: "center", padding: 20, color: "#ff6b6b" }}>
        Error: {error.message}
      </div>
    );
  if (!plan) return null;

  const price = Number(plan.price || 0);
  const discountPercent = Number(plan.discount || 0);
  const discountAmount = (price * discountPercent) / 100;
  const priceAfterDiscount = price - discountAmount;
  const taxPercent = Number(plan.taxPercent || 0);
  const taxAmount = (priceAfterDiscount * taxPercent) / 100;
  const total = Number(plan.totalPrice ?? priceAfterDiscount + taxAmount);

  // dark mode adaptive styles
  const textColor = "var(--text-color, #e5e7eb)";
  const backgroundColor = "var(--bg-color, #111827)";
  const cardBg = "#1f2937";
  const secondaryText = "#9ca3af";
  const accent = "#2563eb";

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        background: cardBg,
        padding: 24,
        borderRadius: 12,
        color: textColor,
        lineHeight: 1.6,
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: 16,
          padding: "8px 12px",
          borderRadius: 8,
          cursor: "pointer",
          background: "#374151",
          color: "#fff",
          border: "none",
        }}
      >
        ← Back
      </button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        <div style={{ flex: "1 1 320px" }}>
          <img
            src={plan.imageUrl}
            alt={plan.planName}
            style={{
              width: "100%",
              borderRadius: 8,
              objectFit: "cover",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          />
          {plan.recommended && (
            <div
              style={{
                marginTop: 8,
                color: "#22c55e",
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              ✅ Recommended Plan
            </div>
          )}
        </div>

        <div style={{ flex: "2 1 500px" }}>
          <h1 style={{ marginTop: 0, color: "#f9fafb" }}>{plan.planName}</h1>
          <div style={{ color: secondaryText, marginBottom: 12 }}>
            {plan.planType} — {plan.duration} — {plan.billingCycle}
          </div>

          <p style={{ color: "#f3f4f6", fontSize: 15 }}>{plan.description}</p>

          {/* Pricing Breakdown */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 16,
            }}
          >
            <div style={priceBox("#374151")}>
              <small>Price</small>
              <strong>
                {currency} {price.toFixed(2)}
              </strong>
            </div>

            <div style={priceBox("#4b5563")}>
              <small>Discount</small>
              <strong>
                {discountPercent}% (-{currency} {discountAmount.toFixed(2)})
              </strong>
            </div>

            <div style={priceBox("#6b7280")}>
              <small>Tax</small>
              <strong>
                {taxPercent}% (+{currency} {taxAmount.toFixed(2)})
              </strong>
            </div>

            <div style={priceBox(accent, true)}>
              <small>Total</small>
              <strong>
                {currency} {total.toFixed(2)}
              </strong>
            </div>
          </div>

          {/* Lists */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ color: "#f9fafb" }}>Features</h3>
            <ul>
              {Array.isArray(plan.features)
                ? plan.features.map((f, i) => (
                    <li key={i} style={{ color: "#d1d5db" }}>
                      {f}
                    </li>
                  ))
                : "No features listed"}
            </ul>

            <h3 style={{ color: "#f9fafb" }}>Perks</h3>
            <ul>
              {Array.isArray(plan.perks)
                ? plan.perks.map((p, i) => (
                    <li key={i} style={{ color: "#d1d5db" }}>
                      {p}
                    </li>
                  ))
                : "No perks listed"}
            </ul>

            <h3 style={{ color: "#f9fafb" }}>Locations</h3>
            <div style={{ color: "#d1d5db" }}>
              {Array.isArray(plan.locations)
                ? plan.locations.join(", ")
                : plan.locations || "N/A"}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <button
              onClick={() =>
                addToCart &&
                addToCart({
                  id: plan.id,
                  planName: plan.planName,
                  totalPrice: total,
                  currency,
                  raw: plan,
                })
              }
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                background: accent,
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Add to Cart — {currency} {total.toFixed(2)}
            </button>

            <button
              onClick={() => alert("Proceed to checkout (not implemented)")}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "1px solid #9ca3af",
                background: "transparent",
                color: "#f3f4f6",
                cursor: "pointer",
              }}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      <hr style={{ margin: "20px 0", borderColor: "#374151" }} />

      <div style={{ color: "#d1d5db", fontSize: 14 }}>
        <div>
          <strong>Trainer access:</strong> {plan.trainerAccess}
        </div>
        <div>
          <strong>Group classes:</strong> {plan.groupClasses ? "Yes" : "No"}
        </div>
        <div>
          <strong>Opening hours:</strong> {plan.openingHours}
        </div>
      </div>
    </div>
  );
};

// small helper for price box style
function priceBox(bg, highlight = false) {
  return {
    flex: "1 1 120px",
    background: bg,
    color: highlight ? "#fff" : "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    textAlign: "center",
  };
}

PlanDetails.propTypes = {
  addToCart: PropTypes.func,
};

export default PlanDetails;
