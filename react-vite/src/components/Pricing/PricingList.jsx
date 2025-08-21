// src/components/Pricing/PricingDropdown.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPricingRules } from "../../redux/pricing/pricingThunks";

export default function PricingDropdown() {
  const dispatch = useDispatch();
  const { pricingRules } = useSelector((state) => state.pricing);

  const [selectedDay, setSelectedDay] = useState("All");
  const [selectedUserType, setSelectedUserType] = useState("All");

  useEffect(() => {
    dispatch(fetchPricingRules());
  }, [dispatch]);

  // unique day_of_week categories
  const days = ["All", ...new Set(pricingRules.map((p) => p.day_of_week))];

  // unique user_type categories
  const userTypes = ["All", ...new Set(pricingRules.map((p) => p.user_type))];

  // filter pricing rules by both day and user type
  const filteredRules = pricingRules.filter((p) => {
    const dayMatch = selectedDay === "All" || p.day_of_week === selectedDay;
    const userTypeMatch =
      selectedUserType === "All" || p.user_type === selectedUserType;
    return dayMatch && userTypeMatch;
  });

  return (
    <div>
      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="day-select" style={{ marginRight: "5px" }}>
          Filter by Day:
        </label>
        <select
          id="day-select"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          style={{ marginRight: "15px", padding: "5px" }}
        >
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <label htmlFor="user-type-select" style={{ marginRight: "5px" }}>
          Filter by User Type:
        </label>
        <select
          id="user-type-select"
          value={selectedUserType}
          onChange={(e) => setSelectedUserType(e.target.value)}
          style={{ padding: "5px" }}
        >
          {userTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {filteredRules.map((rule) => (
          <button
            key={rule.id}
            style={{
              padding: "10px 15px",
              borderRadius: "5px",
              border: "1px solid #333",
              cursor: "pointer",
            }}
          >
            {rule.title} - {rule.day_of_week} - {rule.time_range} - ${rule.rate} -{" "}
            {rule.user_type}
          </button>
        ))}
      </div>
    </div>
  );
}
