import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import DatePicker from "../components/Calender/Calender";
import { setDate } from "../redux/calender/dateSlice";
import NavButton from "../components/NavButton/NavButton";
import "./Layout.css";
import UserNote from "../components/UserNote/UserNote"

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <ModalProvider>
      <div className="app-container">
        {/* Navbar at top */}
        <header className="navbar">
          <NavButton />
          <Navigation />
          
        </header>

        {/* Main content: Calendar + Tee Sheet */}
        <div className="main-content">
          {/* Calendar on left */}
          <aside className="calendar-note-container">
            <DatePicker onDateSelect={(date) => dispatch(setDate(date))} />
            <UserNote />
          </aside>

          {/* Tee Sheet / Route Content */}
          <main className="tee-sheet-container">
            {isLoaded && <Outlet />}
          </main>
        </div>

        <Modal />
      </div>
    </ModalProvider>
  );
}
