import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createPricingRule, editPricingRule } from "../../redux/pricing/pricingThunks"; 
import "./PricingForm.css";

export default function PricingRuleForm({ onSuccess, ruleToEdit = null, closeModal }) {
  const dispatch = useDispatch();

  // Prefill if editing
  const [title, setTitle] = useState(ruleToEdit ? ruleToEdit.title : "");
  const [dayOfWeek, setDayOfWeek] = useState(ruleToEdit ? ruleToEdit.day_of_week : "Monday");
  const [timeRange, setTimeRange] = useState(ruleToEdit ? ruleToEdit.time_range : "");
  const [userType, setUserType] = useState(ruleToEdit ? ruleToEdit.user_type : "Regular");
  const [rate, setRate] = useState(ruleToEdit ? ruleToEdit.rate : "");

  useEffect(() => {
    if (ruleToEdit) {
      setTitle(ruleToEdit.title);
      setDayOfWeek(ruleToEdit.day_of_week);
      setTimeRange(ruleToEdit.time_range);
      setUserType(ruleToEdit.user_type);
      setRate(ruleToEdit.rate);
    }
  }, [ruleToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ruleData = {
      title,
      day_of_week: dayOfWeek,
      time_range: timeRange,
      user_type: userType,
      rate: parseFloat(rate),
    };

    let result;
    if (ruleToEdit) {
      result = await dispatch(editPricingRule({ id: ruleToEdit.id, payload: ruleData }));
    } else {
      result = await dispatch(createPricingRule(ruleData));
    }

    if (result.meta.requestStatus === "fulfilled") {
      if (!ruleToEdit) {
        setTitle("");
        setDayOfWeek("Monday");
        setTimeRange("");
        setUserType("Regular");
        setRate("");
      }
      if (onSuccess) onSuccess(result.payload);
      if (closeModal) closeModal();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pricing-rule-form">

      <div className="pricing-input">
        <label>Title:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="pricing-input">
        <label>Day of Week:</label>
        <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
          {[
            "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
            "Monday-Friday","Monday-Sunday"
          ].map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      <div className="pricing-input">
        <label>Time Range:</label>
        <input
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          placeholder="e.g. 8:00am-10:00am"
          required
        />
      </div>

      <div className="pricing-input">
        <label>User Type:</label>
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          {["Guest", "Member"].map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="pricing-input">
        <label>Rate: $</label>
        <input type="number" step="1.0" value={rate} onChange={(e) => setRate(e.target.value)} required />
      </div>

      <button className="pricing-input pricing-submit-btn" type="submit">
        {ruleToEdit ? "Save Changes" : "Add Pricing Rule"}
      </button>
    </form>
  );
}
