// src/components/ReservationModal/ReservationModal.jsx
import { useModal } from "../../context/Modal";
import ReservationForm from "../Reservation/formResv";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchReservations } from "../../redux/reservation/reservationsThunks";
import { fetchSingleTeeTime } from "../../redux/teeTimes/teeTimeThunks";
import TeeTimeNote from "../Notes/TeeTimeNote";
import "./ReservationModal.css";

export default function ReservationModal({ teeTimeId, onReservationChange }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const { reservations } = useSelector((state) => state.reservations);

  // Fetch reservations for this tee time
  useEffect(() => {
    if (teeTimeId) {
      dispatch(fetchReservations({ teeTimeId })).catch((err) =>
        console.error(err)
      );
    }
  }, [teeTimeId, dispatch]);

  // Make array of 4 spots for forms
  const spots = Array.from({ length: 4 });

const handleClose = async () => {
  if (onReservationChange) {
    try {
      const updatedTeeTime = await dispatch(fetchSingleTeeTime(teeTimeId)).unwrap();
      onReservationChange(updatedTeeTime);
    } catch (err) {
      console.error("Failed to refresh tee time:", err);
    }
  }
  closeModal();
};


  return (
    <div className="reservation-modal-container">
      <div className="modal-content">
        <div className="forms-grid">
          {spots.map((_, index) => {
            const reservation = reservations?.[index];
            return (
              <ReservationForm
                key={index}
                reservation={reservation}
                teeTimeId={teeTimeId}
                onClose={handleClose} // pass down callback
              />
            );
          })}
          <div className="tee-time-note-container">
            <TeeTimeNote teeTimeId={teeTimeId} />
          </div>
        </div>
        <div className="modal-buttons">
          <button
            className="reservation-modal-close-btn bottom"
            onClick={handleClose} 
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
