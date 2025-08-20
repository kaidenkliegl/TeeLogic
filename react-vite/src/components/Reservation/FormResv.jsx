// src/components/Reservations/ReservationForm.jsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createReservation } from "../../redux/reservation/reservationsThunks";

function ReservationForm({ reservation, onClose }) {
  const dispatch = useDispatch();
console.log(reservation)
  const [golferName, setGolferName] = useState("");
  const [totalPrice, setTotalPrice] = useState("");

  // preload data when reservation is loaded
  useEffect(() => {
    if (reservation) {
      setGolferName(reservation.golfer?.fullname || "");
      setTotalPrice(reservation.total_price || "");
    }
  }, [reservation]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!golferName.trim()) return alert("Enter golfer name");
    if (!totalPrice) return alert("Enter total price");

    dispatch(
      createReservation({
        tee_time_id: reservation.tee_time_id,
        golfer: golferName.trim(),
        total_price: totalPrice
      })
    )
      .then(() => {
        if (onClose) onClose();
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px" }}>
      <h3>Edit Reservation</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Golfer Full Name:</label>
          <input
            type="text"
            value={golferName}
            onChange={e => setGolferName(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Total Price:</label>
          <input
            type="number"
            value={totalPrice}
            onChange={e => setTotalPrice(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>

        <button type="submit" style={{ padding: "10px 20px" }}>Save</button>
      </form>
    </div>
  );
}

export default ReservationForm;
