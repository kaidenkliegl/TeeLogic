// src/components/TeeTimes/TeeTimeList.jsx
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchTeeTimes, deleteTeeTime } from "../../redux/teeTimes/teeTimeThunks";
import { useNavigate } from "react-router-dom";

export default function TeeTimeList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { teeTimes, status, error } = useSelector((state) => state.teetimes);
  const selectedDate = useSelector((state) => state.date.selectedDate);
  const currentUser = useSelector((state) => state.session.user);
  const courseId = currentUser?.course_id;

  useEffect(() => {
    if (courseId && selectedDate) {
      const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
      dispatch(fetchTeeTimes({ courseId, date: formattedDate }));
    }
  }, [courseId, selectedDate, dispatch]);

  if (status === "loading") return <p>Loading tee times...</p>;
  if (status === "failed") return <p>Error: {error}</p>;
  if (!teeTimes || teeTimes.length === 0) return <p>No tee times found.</p>;

  return (
    <ul>
      {teeTimes.map((tt) => {
        // Combine player names + empty spots
        const playersDisplay = [
          ...tt.players.map((p) => p.name),
          ...Array(tt.max_players - tt.players.length).fill("Empty"),
        ];

        return (
          <li key={tt.id}>
            <strong>
              {new Date(tt.start_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </strong>{" "}
            – Players: {playersDisplay.join(", ")}
            <button onClick={() => dispatch(deleteTeeTime(tt.id))}>
              Cancel
            </button>
          </li>
        );
      })}
    </ul>
  );
}
