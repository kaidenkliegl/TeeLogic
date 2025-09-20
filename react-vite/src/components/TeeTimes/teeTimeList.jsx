import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CurrentWeather from "../Weather/Weather";
import { editTeeTimeStatus, deleteTeeTime, fetchTeeTimes } from "../../redux/teeTimes/teeTimeThunks";
import { setCurrentTeeTime, updateTeeTimeInStore } from "../../redux/teeTimes/teeTimeSlice";
import { nextDay, prevDay, setDate } from "../../redux/calender/dateSlice";
import { useModal } from "../../context/Modal";
import ReservationModal from "../ReservationModal/reservationModal";
import DatePicker from "../Calender/Calender";
import UserNote from "../UserNote/UserNote";
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
  const [activeButtons, setActiveButtons] = useState({});

  // Fetch tee times on mount or date change
  useEffect(() => {
    if (courseId && selectedDate) {
      const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
      dispatch(fetchTeeTimes({ courseId, date: formattedDate }));
    }
  }, [courseId, selectedDate, dispatch]);

  // Map players for each tee time
  useEffect(() => {
    const updatedPlayers = {};
    teeTimes.forEach((tt) => {
      updatedPlayers[tt.id] = tt.players
        .filter((p) => p.fullname)
        .map((p) => p.fullname);
    });
    setPlayersByTeeTime(updatedPlayers);
  }, [teeTimes]);

  // Open reservation modal
  const openReservationModal = (teeTime) => {
    if (teeTime.status === "blocked") return;

    dispatch(setCurrentTeeTime(teeTime));
    setModalContent(
      <ReservationModal
        teeTimeId={teeTime.id}
        onReservationChange={(updatedTeeTime) => {
          dispatch(updateTeeTimeInStore(updatedTeeTime));
        }}
      />
    );
  };

  // Toggle blocked/available status
  const handleToggleStatus = (teeTime) => {
    const newStatus = teeTime.status === "blocked" ? "available" : "blocked";

    dispatch(editTeeTimeStatus({ teeTimeId: teeTime.id, status: newStatus }))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          // Update only this tee time in store
          dispatch(updateTeeTimeInStore(res.payload));
        }
      })
      .catch((err) =>
        console.error(`Failed to update tee time status to ${newStatus}`, err)
      );
  };

  if (status === "loading") return <p>Loading tee times...</p>;
  if (status === "failed") return <p>Error: {error}</p>;
  if (!teeTimes || teeTimes.length === 0) return <p>No tee times found.</p>;

  return (
    <div className="tee-time-layout">
      <aside className="calendar-note-container">
        <DatePicker onDateSelect={(date) => dispatch(setDate(date))} />
        <UserNote />
      </aside>

      <div className="tee-time-main">
        <div className="tee-time-headers">
          <div className="current-date-nav">
            <button className="todays-btn" onClick={() => dispatch(setDate(new Date()))}>
              Today
            </button>
          </div>
          <div className="date-nav">
            <h1>{new Date(selectedDate).toLocaleDateString()}</h1>
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
              const rowClass = tt.status === "blocked" ? "blocked-tee-time" : "";

              return (
                <tr key={tt.id} className={rowClass}>
                  <td
                    onClick={() => openReservationModal(tt)}
                    style={{
                      cursor: tt.status === "blocked" ? "not-allowed" : "pointer",
                      fontWeight: "bold",
                    }}
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
                          className={`status-btn ${activeButtons[moneyKey] ? "active" : ""}`}
                          onClick={() =>
                            tt.status !== "blocked" &&
                            setActiveButtons((prev) => ({
                              ...prev,
                              [moneyKey]: !prev[moneyKey],
                            }))
                          }
                          disabled={tt.status === "blocked"}
                        >
                          <img src={moneyBtn} alt="money icon" className="status-icon" />
                        </button>

                        <button
                          className={`status-btn ${activeButtons[checkKey] ? "active" : ""}`}
                          onClick={() =>
                            tt.status !== "blocked" &&
                            setActiveButtons((prev) => ({
                              ...prev,
                              [checkKey]: !prev[checkKey],
                            }))
                          }
                          disabled={tt.status === "blocked"}
                        >
                          <img src={checkMark} alt="check icon" className="status-icon" />
                        </button>
                      </td>
                    );
                  })}

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => {
                        if (tt.status === "blocked") return;
                        if (window.confirm("Are you sure you want to delete this tee time?")) {
                          dispatch(deleteTeeTime(tt.id));
                        }
                      }}
                      disabled={tt.status === "blocked"}
                    >
                      Delete
                    </button>

                    <button
                      className={`block-btn ${tt.status === "blocked" ? "available" : "blocked"}`}
                      onClick={() => handleToggleStatus(tt)}
                    >
                      {tt.status === "blocked" ? "Unblock" : "Block"}
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
