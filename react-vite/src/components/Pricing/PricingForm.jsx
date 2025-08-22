import { useState } from "react";
import { useDispatch } from "react-redux";
import { createPricingRule } from "../../redux/pricing/pricingThunks"; // thunk to handle creating a pricing rule
import "./PricingForm.css"
// Component for adding a new pricing rule
export default function PricingRuleForm({ onSuccess }) {
  const dispatch = useDispatch(); // for dispatching Redux actions

  // Local state for form inputs
  const [title, setTitle] = useState(""); // title of the pricing rule
  const [dayOfWeek, setDayOfWeek] = useState("Monday"); // selected day or day range
  const [timeRange, setTimeRange] = useState(""); // time range for pricing rule
  const [userType, setUserType] = useState("Regular"); // type of user (Guest/Member)
  const [rate, setRate] = useState(""); // price

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    // create object to send to backend
    const ruleData = {
      title,
      day_of_week: dayOfWeek,
      time_range: timeRange,
      user_type: userType,
      rate: parseFloat(rate),
    };

    // dispatch the createPricingRule thunk
    const result = await dispatch(createPricingRule(ruleData));

    if (result) {
      // if successful, reset form fields
      setTitle("");
      setDayOfWeek("Monday");
      setTimeRange("");
      setUserType("Regular");
      setRate("");
      // call onSuccess callback if provided
      if (onSuccess) onSuccess(result.payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pricing-rule-form">
      {/* Input for title */}
      <div className="pricing-input">
        <label>Title:</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="pricing-input">
        <label>Day of Week:</label>
        <select
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(e.target.value)}
        >
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
            "Monday-Tuesday",
            "Tuesday-Wednesday",
            "Wednesday-Thursday",
            "Thursday-Friday",
            "Friday-Saturday",
            "Saturday-Sunday",
            "Monday-Wednesday",
            "Tuesday-Thursday",
            "Wednesday-Friday",
            "Thursday-Saturday",
            "Friday-Sunday",
            "Monday-Thursday",
            "Tuesday-Friday",
            "Wednesday-Saturday",
            "Thursday-Sunday",
            "Monday-Friday",
            "Tuesday-Saturday",
            "Wednesday-Sunday",
            "Monday-Saturday",
            "Tuesday-Sunday",
            "Monday-Sunday",
          ].map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>

      {/* Input for time range */}
      <div className="pricing-input">
        <label>Time Range:</label>
        <input
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          placeholder="e.g. 8:00am-10:00am"
          required
        />
      </div>

      {/* Dropdown for user type */}
      <div className="pricing-input">
        <label>User Type:</label>
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          {["Guest", "Member"].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Input for rate */}
      <div className="pricing-input">
        <label>Rate: $</label>
        <input
          type="number"
          step="1.0"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          required
        />
      </div>

      {/* Submit button */}
      <button  className="pricing-input pricing-submit-btn"type="submit">Add Pricing Rule</button>
    </form>
  );
}
