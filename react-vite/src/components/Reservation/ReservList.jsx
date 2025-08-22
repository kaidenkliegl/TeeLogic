// src/components/Reservations/ReservationList.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReservations } from "../../redux/reservation/reservationsThunks";
import ReservationForm from "./formResv";

export default function ReservationList({ teeTimeId }) {
  const dispatch = useDispatch();
  const { reservations, status, error } = useSelector((state) => state.reservations);

  // Fetch reservations for this tee time when component mounts or teeTimeId changes
  useEffect(() => {
    if (teeTimeId) {
      dispatch(fetchReservations({ teeTimeId }));
    }
  }, [teeTimeId, dispatch]);

  if (status === "loading") return <p>Loading reservations...</p>;
  if (status === "failed") return <p>Error: {error}</p>;
  if (!reservations || reservations.length === 0) return <p>No reservations yet.</p>;

  // Filter reservations for this specific tee time
  const teeTimeReservations = reservations.filter(r => r.tee_time_id === teeTimeId);

  if (!teeTimeReservations || teeTimeReservations.length === 0) {
    return <p>No reservations for this tee time.</p>;
  }

  return (
    <div>
      {teeTimeReservations.map(reservation => (
        <ReservationForm
          key={reservation.id}
          reservation={reservation}
          onClose={() => {
            // Refresh reservations for this tee time when the form closes
            if (teeTimeId) dispatch(fetchReservations({ teeTimeId }));
          }}
        />
      ))}
    </div>
  );
}
