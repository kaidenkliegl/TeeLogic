import { useModal } from "../../context/Modal";
import { Link, useLocation } from "react-router-dom";
import "./NavButton.css";

export default function ModalNavButton() {
  const { setModalContent, closeModal } = useModal();
  const location = useLocation();

  const routeLabels = {
    "/signup": "Signup Staff",
    "/golfer/all": "All Golfers",
    "/golfer/new": "New Golfer",
    "/teetimes/all": "All Tee Times",
    "/pricing/all": "Pricing Rules",
    "/settings": "Tee Settings"
  };

  const buttonLabel = routeLabels[location.pathname] || "TeeLogic";

  const openNavModal = () => {
    setModalContent(
      <div className="modal-nav-container modal-top-left">
        <ul>
          {Object.entries(routeLabels).map(([path, label]) => (
            <li key={path}>
              <Link to={path} onClick={closeModal}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="nav-component-container">
      <button className="Logo">TL</button>
      <div className="dropdown">
        <button className="open-nav-btn" onClick={openNavModal}>
          {buttonLabel}
        </button>
        <span className="dropdown-arrow">&#x25BC;</span>
      </div>
    </div>
  );
}
