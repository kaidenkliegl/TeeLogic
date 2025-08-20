// src/components/Reservations/ReservationList.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReservations } from "../../redux/reservation/reservationsThunks";
import ReservationForm from "./FormResv";

export default function ReservationList({ teeTimeId }) {
  const dispatch = useDispatch();
  const { reservations, status, error } = useSelector((state) => state.reservations);
  useEffect(() => {
    if (teeTimeId) {
      dispatch(fetchReservations({ teeTimeId }));
    }
  }, [teeTimeId, dispatch]);

  if (status === "loading") return <p>Loading reservations...</p>;
  if (status === "failed") return <p>Error: {error}</p>;
  if (!reservations || reservations.length === 0) return <p>No reservations yet.</p>;
  // filter reservations for this tee time
  const teeTimeReservations = reservations.filter(r => r.tee_time_id === teeTimeId);
  return (
    <div>
      {teeTimeReservations.map(reservation => {
        console.log("Reservation object:", reservation); // <- check the object
        return (
          <ReservationForm
            key={reservation.id}
            reservation={reservation}
          />
        );
      })}
    </div>
  );
}
