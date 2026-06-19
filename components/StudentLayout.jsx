import { NavLink } from "react-router-dom";
import "../student/StudentPages.css";

function StudentLayout({ children }) {
  return (
    <div className="student-layout">
      <nav className="student-nav">
        <NavLink to="/student/dashboard" className="student-nav-link">
          Dashboard
        </NavLink>
        <NavLink to="/student/library" className="student-nav-link">
          Library
        </NavLink>
        <NavLink to="/student/inventory" className="student-nav-link">
          Inventory
        </NavLink>
        <NavLink to="/student/history" className="student-nav-link">
          History
        </NavLink>
      </nav>
      <div className="student-content">{children}</div>
    </div>
  );
}

export default StudentLayout;
