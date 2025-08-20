import { useModal } from "../../context/Modal";
import ReservationForm from "../Reservation/FormResv";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchReservations } from "../../redux/reservation/reservationsThunks";

export default function ReservationModal({ teeTimeId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const { reservations } = useSelector((state) => state.reservations);

  // Fetch reservations for this tee time
  useEffect(() => {
    if (teeTimeId) {
      dispatch(fetchReservations({ teeTimeId })).catch((err) => console.error(err));
    }
  }, [teeTimeId, dispatch]);

  // Make array of 4 spots for forms
  const spots = Array.from({ length: 4 });

  return (
    <div style={{ padding: "20px", maxWidth: "500px", background: "#fff" }}>
      <h2>Reservations for Tee Time</h2>
      {spots.map((_, index) => {
        // Get reservation at this index if it exists
        const reservation = reservations?.[index];
        return (
          <ReservationForm
            key={index}
            reservation={reservation}
            teeTimeId={teeTimeId}
            onClose={closeModal}
          />
        );
      })}
      <button
        onClick={closeModal}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        Close
      </button>
    </div>
  );
}
