import "./navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/userSlice"

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem("token");
    navigate("/auth")
  };

  return (
    <>
      <div className="nav-wrapper">
        <div className="logo-section">
          <p className="text-clr">LOGO</p>
        </div>
        <div className="recent-section">
          <p className="text-clr title">Recents</p>
          <ul>
            <li>
              <NavLink
                href="www.google.com"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <p className="text-clr">Chat 1</p>
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="profile-section">
          <div className="profile-wrapper">
            <div className="name-logo">
              <p className="text-clr">NN</p>
            </div>
            <div className="name">
              <p className="text-clr">Nishant Nayan</p>
            </div>
          </div>
          <div className="logout-btn">
            <button onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
