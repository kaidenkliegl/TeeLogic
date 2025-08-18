import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function DatePicker({ onDateSelect }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleChange = (date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date); 
    }
  };

  return (
    <div className="calendar-wrapper">
      <Calendar onChange={handleChange} value={selectedDate} />
      <p className="mt-2 text-gray-700">
        Selected Date: <strong>{selectedDate.toDateString()}</strong>
      </p>
    </div>
  );
}
