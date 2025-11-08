import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const PricingOption = ({ addToCart }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch("/PricingData.json");
        if (!res.ok) throw new Error(`Failed to fetch JSON (status ${res.status})`);
        const text = await res.text();
        if (text.trim().startsWith("<")) {
          throw new Error("Server returned HTML — check file path or put PricingData.json in public/");
        }
        const json = JSON.parse(text);
        if (mounted) setData(json);
      } catch (err) {
        console.error("Error loading pricing data:", err);
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div style={{ textAlign: "center", padding: 20 }}>Loading pricing data…</div>;
  if (error) return <div style={{ textAlign: "center", color: "crimson", padding: 20 }}>Error: {error.message}</div>;
  if (!data || !Array.isArray(data.pricingOptions)) return <div style={{ textAlign: "center", padding: 20 }}>No pricing data available.</div>;

  const currency = data.currency || "";

  return (
    <section>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
        {data.pricingOptions.map(plan => (
          <article key={plan.id} style={{
            width: 320, border: "1px solid #e6e6e6", borderRadius: 12, overflow: "hidden",
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", background: "#fff"
          }}>
            <div style={{ height: 160, position: "relative", background: "#f7f7f7" }}>
              <img
                src={plan.imageUrl}
                alt={plan.planName}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={(e) => { e.currentTarget.style.objectFit = "contain"; e.currentTarget.style.background = "#ddd"; }}
              />
              {plan.recommended && (
                <span style={{
                  position: "absolute", top: 10, right: 10, backgroundColor: "#059669",
                  color: "#fff", padding: "6px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700
                }}>Recommended</span>
              )}
            </div>

            <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ margin: 0 }}>{plan.planName}</h3>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{plan.planType}</div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{currency} {Number(plan.price).toFixed(2)}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{plan.billingCycle}</div>
                </div>
              </div>

              <p style={{ margin: "8px 0 12px", fontSize: 14, color: "#374151", lineHeight: 1.4 }}>
                {plan.description}
              </p>

              <ul style={{ paddingLeft: 16, margin: "0 0 12px 0", color: "#111827", flex: "0 0 auto" }}>
                {Array.isArray(plan.features) && plan.features.slice(0, 3).map((f, i) => (
                  <li key={i} style={{ marginBottom: 6, fontSize: 13 }}>{f}</li>
                ))}
              </ul>

              <div style={{ marginTop: "auto", display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  <div>Trainer: {plan.trainerAccess}</div>
                  <div>Hours: {plan.openingHours}</div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <Link to={`/plans/${plan.id}`} style={{
                    padding: "8px 12px", borderRadius: 8, background: "#e5e7eb",
                    textDecoration: "none", color: "#111827", fontWeight: 700, display: "inline-block"
                  }}>
                    View Details
                  </Link>

                  <button
                    type="button"
                    onClick={() => addToCart && addToCart({
                      id: plan.id,
                      planName: plan.planName,
                      totalPrice: Number(plan.totalPrice || plan.price || 0),
                      currency,
                      raw: plan
                    })}
                    style={{
                      padding: "8px 12px", borderRadius: 8, border: "none", background: "#2563eb",
                      color: "#fff", fontWeight: 700, cursor: "pointer"
                    }}
                  >
                    Join — {currency} {Number(plan.totalPrice || plan.price || 0).toFixed(2)}
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

PricingOption.propTypes = {
  addToCart: PropTypes.func,
};

export default PricingOption;
