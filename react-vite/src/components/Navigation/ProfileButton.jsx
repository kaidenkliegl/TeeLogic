// src/components/Navigation/ProfileButton.jsx
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./ProfileButton.css";

function ProfileButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = async (e) => {
    e.preventDefault();
    await dispatch(thunkLogout());
    closeMenu();
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <>
      <button className="profile-button" onClick={toggleMenu}>
        <FaUserCircle className="profile-icon" />
      </button>
      {showMenu && (
        <ul className="profile-dropdown" ref={ulRef}>
          {user ? (
            <>
              <li className="profile-item">{user.username}</li>
              <li className="profile-item">{user.email}</li>
              <li className="profile-item">
                <button className="profile-logout-btn" onClick={logout}>
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="profile-item">
                <OpenModalMenuItem
                  itemText="Log In"
                  onItemClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                  className="open-modal-item"
                />
              </li>
              <li className="profile-item">
                <OpenModalMenuItem
                  itemText="Sign Up"
                  onItemClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                  className="open-modal-item"
                />
              </li>
            </>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
