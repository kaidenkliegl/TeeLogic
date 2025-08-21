import { useModal } from "../../context/Modal";
import ReservationForm from "../Reservation/FormResv";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchReservations } from "../../redux/reservation/reservationsThunks";
import "./ReservationModal.css"

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
    <div className="reservation-modal-container">
      {spots.map((_, index) => {
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
      <button className="reservation-modal-close-btn" onClick={closeModal}>
        Close
      </button>
    </div>
  );
}
