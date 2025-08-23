import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import NavButton from "../components/NavButton/NavButton";
import "./Layout.css";

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  // Determine if we should show the navbar
  const showNavbar = location.pathname !== "/login";

  return (
    <ModalProvider>
      <div className="app-container">
        {/* Navbar at top */}
        {showNavbar && (
          <header className="navbar">
            <NavButton />
            <Navigation />
          </header>
        )}

        {/* Main content */}
        <div className="main-content">
          <main className="page-content">
            {isLoaded && <Outlet />}
          </main>
        </div>

        <Modal />
      </div>
    </ModalProvider>
  );
}
