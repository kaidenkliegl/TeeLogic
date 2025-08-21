import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { setDate } from "../../redux/calender/dateSlice";

export default function DatePicker() {
  const dispatch = useDispatch();
  const selectedDate = useSelector((state) => state.date.selectedDate);

  const handleChange = (date) => {
    dispatch(setDate(date)); // update Redux instead of local state
  };

  return (
    <div className="calendar-wrapper">
      <Calendar onChange={handleChange} value={selectedDate} />
      <p className="mt-2 text-gray-700">
        Selected Date: <strong>{new Date(selectedDate).toDateString()}</strong>
      </p>
    </div>
  );
}
