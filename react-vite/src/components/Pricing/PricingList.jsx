import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import {
  fetchPricingRules,
  deletePricingRule,
} from "../../redux/pricing/pricingThunks";
import PricingRuleForm from "./PricingForm";
import "./PricingList.css"; 

export default function PricingDropdown() {
  const dispatch = useDispatch();
  const { pricingRules } = useSelector((state) => state.pricing);
  const { setModalContent, closeModal } = useModal(); // from your context

  const [selectedDay, setSelectedDay] = useState("All");
  const [selectedUserType, setSelectedUserType] = useState("All");

  useEffect(() => {
    dispatch(fetchPricingRules());
  }, [dispatch]);

  const days = ["All", ...new Set(pricingRules.map((p) => p.day_of_week))];
  const userTypes = ["All", ...new Set(pricingRules.map((p) => p.user_type))];

  const filteredRules = pricingRules.filter((p) => {
    const dayMatch = selectedDay === "All" || p.day_of_week === selectedDay;
    const userTypeMatch = selectedUserType === "All" || p.user_type === selectedUserType;
    return dayMatch && userTypeMatch;
  });

  const openEditModal = (rule) => {
    setModalContent(
      <PricingRuleForm
        ruleToEdit={rule}
        closeModal={closeModal}
        onSuccess={() => dispatch(fetchPricingRules())}
      />
    );
  };

  return (
    <>
      <div className="pricing-dropdown-container">
        <PricingRuleForm onSuccess={() => dispatch(fetchPricingRules())} />

        <div className="pricing-filters">
          <label htmlFor="day-select">Filter by Day:</label>
          <select id="day-select" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
            {days.map((day) => <option key={day} value={day}>{day}</option>)}
          </select>

          <label htmlFor="user-type-select">Filter by User Type:</label>
          <select id="user-type-select" value={selectedUserType} onChange={(e) => setSelectedUserType(e.target.value)}>
            {userTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        <div className="pricing-rules-list">
          {filteredRules.map((rule) => (
            <div key={rule.id} className="pricing-rule-item">
              <button
                className="pricing-rule-button"
                onClick={() => openEditModal(rule)}
              >
                {rule.title} - {rule.day_of_week} - {rule.time_range} - $
                {rule.rate} - {rule.user_type}
              </button>
              <button
                className="delete-rule-btn"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this pricing rule?")) {
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
