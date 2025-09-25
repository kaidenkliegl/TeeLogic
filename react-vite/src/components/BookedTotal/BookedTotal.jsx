import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchReservations } from "../../redux/reservation/reservationsThunks";

export default function BookedTotal({ date }) {
  const dispatch = useDispatch();
  const { reservations } = useSelector((state) => state.reservations);

  useEffect(() => {
    if (date) {
      let reservationsList = dispatch(fetchReservations(date));
    }
  }, [date, dispatch]);


  const totalBooked = reservationsList.length;

  return (
    <div className="booked-total-container">
      <h3>Reservations Booked: {totalBooked}</h3>
    </div>
  );
}
