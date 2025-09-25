// src/pages/GolferDetail.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGolfer, fetchGolferReservations, deleteGolfer } from "../../redux/golfers/golferThunk";
import "./GolferDetail.css";

export default function GolferDetail({ golferId, onDelete }) {
  const dispatch = useDispatch();
  const [deleted, setDeleted] = useState(false); // track if current golfer was deleted

  const { currentGolfer, reservations, resStatus, resError, golfers } = useSelector(
    (state) => state.golfers
  );

  const golfer = golfers.find((g) => g.id === parseInt(golferId));

  // Reset deleted state when a new golfer is selected
  useEffect(() => {
    setDeleted(false);
    if (golferId) {
      dispatch(fetchGolferReservations(golferId));
      dispatch(fetchGolfer(golferId));
    }
  }, [golferId, dispatch]);

  const handleDelete = () => {
    if (!golfer) return;
    const confirmDelete = window.confirm(`Are you sure you want to delete ${golfer.fullname}?`);
    if (confirmDelete) {
      dispatch(deleteGolfer(golfer.id))
        .unwrap()
        .then(() => {
          setDeleted(true);
          if (onDelete) onDelete(); // optional callback to clear selection
        })
        .catch((err) => console.error("Failed to delete golfer", err));
    }
  };

  //format to style the tee time
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show only deleted message if deleted
  if (deleted) {
    return <p className="success-text">Successfully deleted</p>;
  }

  return (
    <div className="golfer-detail-container">
      <h1 className="golfer-name">{golfer ? golfer.fullname : "Golfer Detail"}</h1>
      <p>Member Status: {currentGolfer?.member_status || "None"}</p>
      <p>Phone Number: {currentGolfer?.phone_number || "None"}</p>
      <p>Email: {currentGolfer?.email || "None"}</p>

      {/* Delete Golfer Button */}
      {golfer && (
        <button className="delete-golfer-btn" onClick={handleDelete}>
          Delete Golfer
        </button>
      )}

      <h2 className="reservations-header">Reservations</h2>
      {resStatus === "loading" && <p>Loading reservations...</p>}
      {resStatus === "failed" && <p className="error-text">Error: {resError}</p>}
      {resStatus === "succeeded" && reservations.length === 0 && (
        <p>No reservations found for this golfer.</p>
      )}
      {resStatus === "succeeded" && reservations.length > 0 && (
        <div className="reservations-list">
          {reservations.map((r) => (
            <div key={r.id} className="reservation-card">
              <p><strong> Reservation created on:</strong> {formatDate(r.created_at)}</p>
              <p><strong>Tee Time:</strong> {formatDate(r.teeTimeStart)}</p>
              <p><strong>Price:</strong> ${r.total_price.toFixed(2)}</p>
              <p><strong>Status:</strong> {r.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
