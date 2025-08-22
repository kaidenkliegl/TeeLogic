import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReservations } from "../../redux/reservation/reservationsThunks";

export default function BookedTotal({ date }) {
  const dispatch = useDispatch();
  const { reservations, status, error } = useSelector((state) => state.reservations);

  useEffect(() => {
    if (date) {
      dispatch(fetchReservations({ date }));
    }
  }, [date, dispatch]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  // Filter reservations for the given date
  const reservationsForDate = reservations?.filter(
    (r) => new Date(r.created_at).toDateString() === new Date(date).toDateString()
  );

  const totalBooked = reservationsForDate?.length || 0;

  return (
    <div className="booked-total-container">
      <h3>Reservations Booked for {new Date(date).toLocaleDateString()}:</h3>
      <p>{totalBooked}</p>
    </div>
  );
}
