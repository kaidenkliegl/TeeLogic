import { useState } from "react";
import { useDispatch } from "react-redux";
import { addGolfer, updateGolfer } from "../../redux/golfers/golferThunk";
import "./GolferForm.css";

export default function GolferForm({ golfer }) {
  const dispatch = useDispatch();

  const [fullname, setFullname] = useState(golfer?.fullname || "");
  const [email, setEmail] = useState(golfer?.email || "");
  const [phone, setPhone] = useState(golfer?.phone || "");
  const [memberStatus, setMemberStatus] = useState(golfer?.member_status || "guest");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const golferData = { fullname, email, phone, member_status: memberStatus };

    if (golfer) {
      dispatch(updateGolfer({ id: golfer.id, updates: golferData }));
    } else {
      dispatch(addGolfer(golferData));
    }

    setSaved(true); // mark as saved
  };

  if (saved) {
    return (
      <div className="golfer-saved">
        <span className="check-mark">✔</span> Saved
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="golfer-form">
      <h2 className="form-title">{golfer ? "Edit Golfer" : "Add Golfer"}</h2>

      <input
        className="form-input"
        placeholder="Full Name"
        value={fullname}
        onChange={(e) => setFullname(e.target.value)}
        required
      />

      <input
        className="form-input"
        placeholder="Email (optional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="form-input"
        placeholder="Phone (optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <select
        className="form-select"
        value={memberStatus}
        onChange={(e) => setMemberStatus(e.target.value)}
      >
        <option value="guest">Guest</option>
        <option value="member">Member</option>
        <option value="league">League</option>
      </select>

      <button type="submit" className="form-submit">
        {golfer ? "Update" : "Add"}
      </button>
    </form>
  );
}
