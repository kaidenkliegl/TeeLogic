import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CurrentWeather from "../Weather/Weather";
import {
  fetchTeeTimes,
  deleteTeeTime,
} from "../../redux/teeTimes/teeTimeThunks";
import { setCurrentTeeTime } from "../../redux/teeTimes/teeTimeSlice";
import { nextDay, prevDay } from "../../redux/calender/dateSlice";
import { useModal } from "../../context/Modal";
import ReservationModal from "../ReservationModal/ReservationModal";
import "./TeeTime.css";
import moneyBtn from "../../../public/dollar-symbol.png";
import checkMark from "../../../public/check-mark.png";

export default function TeeTimeList() {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();

  const { teeTimes, status, error } = useSelector((state) => state.teetimes);
  const selectedDate = useSelector((state) => state.date.selectedDate);
  const currentUser = useSelector((state) => state.session.user);
  const courseId = currentUser?.course_id;

  const [playersByTeeTime, setPlayersByTeeTime] = useState({});

  // Fetch tee times
  useEffect(() => {
    if (courseId && selectedDate) {
      const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
      dispatch(fetchTeeTimes({ courseId, date: formattedDate }));
    }
  }, [courseId, selectedDate, dispatch]);

  // Update players list
  useEffect(() => {
    const updatedPlayers = {};
    teeTimes.forEach((tt) => {
      updatedPlayers[tt.id] = tt.players
        .filter((p) => p.fullname)
        .map((p) => p.fullname);
    });
    setPlayersByTeeTime(updatedPlayers);
  }, [teeTimes]);

  // Set current tee time and open modal
  const openReservationModal = (teeTime) => {
    dispatch(setCurrentTeeTime(teeTime)); // set current tee time in Redux
    setModalContent(<ReservationModal teeTimeId={teeTime.id} />);
  };

  if (status === "loading") return <p>Loading tee times...</p>;
  if (status === "failed") return <p>Error: {error}</p>;
  if (!teeTimes || teeTimes.length === 0) return <p>No tee times found.</p>;

  return (
    <>
      <div>
        <CurrentWeather />
      </div>

      <div className="date-nav">
        <button onClick={() => dispatch(prevDay())}>⬅️</button>
        <h1>{new Date(selectedDate).toLocaleDateString()}</h1>
        <button onClick={() => dispatch(nextDay())}>➡️</button>
      </div>

      <table className="tee-sheet">
        <tbody>
          {teeTimes.map((tt) => {
            const players = playersByTeeTime[tt.id] || [];
            const filledPlayers = [
              ...players,
              ...Array(tt.max_players - players.length).fill(""),
            ];

            return (
              <tr key={tt.id}>
                <td
                  onClick={() => openReservationModal(tt)} // pass full tee time
                  style={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  {new Date(tt.start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                {filledPlayers.map((p, index) => (
                  <td key={index}>
                    {p}
                    <button className="status-btn">
                      <img
                        src={moneyBtn}
                        alt="money icon"
                        className="status-icon"
                      />
                    </button>
                    <button className="status-btn">
                      <img
                        src={checkMark}
                        alt="check icon"
                        className="status-icon"
                      />
                    </button>
                  </td>
                ))}
                <td>
                  <button onClick={() => dispatch(deleteTeeTime(tt.id))}>
                    Cancel
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
