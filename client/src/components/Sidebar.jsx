import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import Logo from "./Logo.jsx";

function Icon({ children }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="logo">
        <Logo />
        <span>Gradious</span>
      </div>

      <NavLink to="/dashboard" className="side-link">
        <Icon>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </Icon>
        Dashboard
      </NavLink>

      <NavLink to="/bugs" className="side-link">
        <Icon>
          <rect x="8" y="6" width="8" height="14" rx="4" />
          <path d="M8 10H4M16 10h4M8 15H4M16 15h4M9 3l2 3M15 3l-2 3" />
        </Icon>
        Bugs
      </NavLink>

      <NavLink to="/projects" className="side-link">
        <Icon>
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </Icon>
        Projects
      </NavLink>

      <div className="side-user">
        <div className="side-user-info">
          <div className="avatar">{user.name.charAt(0)}</div>
          <div>
            <div className="side-user-name">{user.name}</div>
            <div className="side-user-role">{user.role}</div>
          </div>
        </div>
        <button className="secondary logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
