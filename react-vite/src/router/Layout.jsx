import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import NavButton from "../components/NavButton/NavButton";
import "./Layout.css";

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

        {/* Main content */}
        <div className="main-content">
          {/* Route Content (Tee sheet, Golfer detail, etc.) */}
          <main className="page-content">
            {isLoaded && <Outlet />}
          </main>
        </div>

        <Modal />
      </div>
    </ModalProvider>
  );
}
