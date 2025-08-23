import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CurrentWeather from "../Weather/Weather";
import { editTeeTime } from "../../redux/teeTimes/teeTimeThunks";
import DatePicker from "../Calender/Calender";
import UserNote from "../UserNote/UserNote";
import {
  fetchTeeTimes,
  deleteTeeTime,
} from "../../redux/teeTimes/teeTimeThunks";
import { setCurrentTeeTime } from "../../redux/teeTimes/teeTimeSlice";
import { nextDay, prevDay, setDate } from "../../redux/calender/dateSlice";
import { useModal } from "../../context/Modal";
import ReservationModal from "../ReservationModal/reservationModal";
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
  const [activeButtons, setActiveButtons] = useState({}); // <-- track clicked buttons

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

  const openReservationModal = (teeTime) => {
    dispatch(setCurrentTeeTime(teeTime));

    // Pass a callback to refresh tee times when modal closes
    setModalContent(
      <ReservationModal
        teeTimeId={teeTime.id}
        onReservationChange={() => {
          const formattedDate = new Date(selectedDate)
            .toISOString()
            .split("T")[0];
          dispatch(fetchTeeTimes({ courseId, date: formattedDate }));
        }}
      />
    );
  };

  const handleBlock = (teeTime) => {
    dispatch(
      editTeeTime({ teeTimeId: teeTime.id, teeTimeData: { status: "blocked" } })
    )
      .unwrap()
      .then(() => {
        const formattedDate = new Date(selectedDate)
          .toISOString()
          .split("T")[0];
        dispatch(fetchTeeTimes({ courseId, date: formattedDate }));
      })
      .catch((err) => console.error("Failed to block tee time", err));
  };

  if (status === "loading") return <p>Loading tee times...</p>;
  if (status === "failed") return <p>Error: {error}</p>;
  if (!teeTimes || teeTimes.length === 0) return <p>No tee times found.</p>;

  return (
    <div className="tee-time-layout">
      {/* Calendar + Notes on the left */}
      <aside className="calendar-note-container">
        <DatePicker onDateSelect={(date) => dispatch(setDate(date))} />
        <UserNote />
      </aside>

      {/* Tee sheet on the right */}
      <div className="tee-time-main">
        <div className="tee-time-headers">
          <div className="current-date-nav">
            <button
              className="todays-btn"
              onClick={() => dispatch(setDate(new Date()))}
            >
              Today
            </button>
          </div>
          <div className="date-nav">
            <h1>{new Date(selectedDate).toLocaleDateString()}</h1>{" "}
            <button onClick={() => dispatch(prevDay())}>&lt;</button>
            <button onClick={() => dispatch(nextDay())}>&gt;</button>
          </div>
          <CurrentWeather />
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
                    onClick={() => openReservationModal(tt)}
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                  >
                    {new Date(tt.start_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  {filledPlayers.map((p, index) => {
                    const moneyKey = `${tt.id}-${index}-money`;
                    const checkKey = `${tt.id}-${index}-check`;

                    return (
                      <td key={index}>
                        {p}
                        <button
                          className={`status-btn ${
                            activeButtons[moneyKey] ? "active" : ""
                          }`}
                          onClick={() =>
                            setActiveButtons((prev) => ({
                              ...prev,
                              [moneyKey]: !prev[moneyKey],
                            }))
                          }
                        >
                          <img
                            src={moneyBtn}
                            alt="money icon"
                            className="status-icon"
                          />
                        </button>
                        <button
                          className={`status-btn ${
                            activeButtons[checkKey] ? "active" : ""
                          }`}
                          onClick={() =>
                            setActiveButtons((prev) => ({
                              ...prev,
                              [checkKey]: !prev[checkKey],
                            }))
                          }
                        >
                          <img
                            src={checkMark}
                            alt="check icon"
                            className="status-icon"
                          />
                        </button>
                      </td>
                    );
                  })}
                  <td >
                    <button
                      className="delete-btn"
                      onClick={() => {
                        const confirmDelete = window.confirm(
                          "Are you sure you want to delete this tee time?"
                        );
                        if (confirmDelete) {
                          dispatch(deleteTeeTime(tt.id));
                        }
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className={`block-btn ${
                        tt.status === "blocked" ? "disabled" : ""
                      }`}
                      onClick={() => handleBlock(tt)}
                      disabled={tt.status === "blocked"}
                    >
                      {tt.status === "blocked" ? "Blocked" : "Block"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
