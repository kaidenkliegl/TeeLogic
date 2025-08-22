import { useModal } from "../../context/Modal";
import { Link } from "react-router-dom";
import "./NavButton.css";

export default function ModalNavButton() {
  const { setModalContent, closeModal } = useModal();

  const openNavModal = () => {
    setModalContent(
      <div className="modal-nav-container modal-top-left" >
        <ul>
          <li><Link to="/" onClick={closeModal}>Home</Link></li>
          <li><Link to="/login" onClick={closeModal}>Login</Link></li>
          <li><Link to="/signup" onClick={closeModal}>Signup</Link></li>
          <li><Link to="/golfer/all" onClick={closeModal}>All Golfers</Link></li>
          <li><Link to="/golfer/new" onClick={closeModal}>New Golfer</Link></li>
          <li><Link to="/teetimes/all" onClick={closeModal}>All Tee Times</Link></li>
          <li><Link to="/pricing/all" onClick={closeModal}>Pricing Rules</Link></li>
        </ul>
      </div>
    );
  };

  return (
    <button className="open-nav-btn" onClick={openNavModal}>
      Open Navigation
    </button>
  );
}
