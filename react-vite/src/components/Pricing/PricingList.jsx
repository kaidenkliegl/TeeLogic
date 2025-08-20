import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPricingRules,
  deletePricingRule,
} from "../../redux/pricing/pricingThunks"

export default function PricingRules() {
  const dispatch = useDispatch();
  const { pricingRules, status, error } = useSelector(
    (state) => state.pricing
  );

  useEffect(() => {
    dispatch(fetchPricingRules());
  }, [dispatch]);

  if (status === "loading") return <p>Loading pricing rules...</p>;
  if (status === "failed") return <p>Error: {error}</p>;
  if (!pricingRules || pricingRules.length === 0) return <p>No pricing rules yet.</p>;

  return (
    <div>
      <h2>Pricing Rules</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {pricingRules.map((rule) => (
          <button
            key={rule.id}
            style={{
              padding: "10px 15px",
              borderRadius: "5px",
              border: "1px solid #333",
              cursor: "pointer",
            }}
            onClick={() => {
              console.log("Clicked pricing rule:", rule);
            }}
          >
            {rule.title} - {rule.day_of_week} - {rule.time_range} - ${rule.rate}
          </button>
        ))}
      </div>
    </div>
  );
}
