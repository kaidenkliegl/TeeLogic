import { useState } from "react";
import { useDispatch } from "react-redux";
import { addGolfer, updateGolfer } from "../../redux/golfers/golferThunk";

export default function GolferForm({ golfer }) {
  const [name, setName] = useState(golfer?.name || "");
  const [email, setEmail] = useState(golfer?.email || "");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (golfer) {
      dispatch(updateGolfer({ id: golfer.id, updates: { name, email } }));
    } else {
      dispatch(addGolfer({ name, email }));
    }
    setName("");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded mt-4">
      <h2>{golfer ? "Edit Golfer" : "Add Golfer"}</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border p-1 mb-2 w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" className="submit-btn">
        {golfer ? "Update" : "Add"}
      </button>
    </form>
  );
}
