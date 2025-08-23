// src/components/Pricing/PricingDropdown.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPricingRules, deletePricingRule } from "../../redux/pricing/pricingThunks";
import PricingForm from "./PricingForm";
import "./PricingList.css"; // import CSS file

export default function PricingDropdown() {
  const dispatch = useDispatch();
  const { pricingRules } = useSelector((state) => state.pricing);

  // track which day and user type are selected
  const [selectedDay, setSelectedDay] = useState("All");
  const [selectedUserType, setSelectedUserType] = useState("All");

  // fetch pricing rules when component mounts
  useEffect(() => {
    dispatch(fetchPricingRules());
  }, [dispatch]);

  // unique days and user types from pricing rules
  const days = ["All", ...new Set(pricingRules.map((p) => p.day_of_week))];
  const userTypes = ["All", ...new Set(pricingRules.map((p) => p.user_type))];

  // filter rules based on selected day and user type
  const filteredRules = pricingRules.filter((p) => {
    const dayMatch = selectedDay === "All" || p.day_of_week === selectedDay;
    const userTypeMatch =
      selectedUserType === "All" || p.user_type === selectedUserType;
    return dayMatch && userTypeMatch;
  });

  return (
    <>
      <h3 className="pricing-rule-header">Create new pricing rule</h3>
      <div className="pricing-dropdown-container">
        <PricingForm />
        {/* dropdown filters */}
        <div className="pricing-filters">
          <label htmlFor="day-select">Filter by Day:</label>
          <select
            id="day-select"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          <label htmlFor="user-type-select">Filter by User Type:</label>
          <select
            id="user-type-select"
            value={selectedUserType}
            onChange={(e) => setSelectedUserType(e.target.value)}
          >
            {userTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* filtered pricing rules displayed as buttons */}
        <div className="pricing-rules-list">
          {filteredRules.map((rule) => (
            <div key={rule.id} className="pricing-rule-item">
              <button className="pricing-rule-button">
                {rule.title} - {rule.day_of_week} - {rule.time_range} - $
                {rule.rate} - {rule.user_type}
              </button>
              <button
                className="delete-rule-btn"
                onClick={() => {
                  const confirmDelete = window.confirm(
                    "Are you sure you want to delete this pricing rule?"
                  );
                  if (confirmDelete) {
                    dispatch(deletePricingRule(rule.id));
                  }
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
