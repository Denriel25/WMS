import { NavLink } from "react-router-dom";
import "./StaffLayout.css";

function StaffLayout({ children }) {
  return (
    <div className="staff-layout">
      <nav className="staff-nav">
        <h2>Staff Menu</h2>
        <NavLink to="/staff/dashboard" className="staff-nav-link">
          Dashboard
        </NavLink>
        <NavLink to="/staff/inventory" className="staff-nav-link">
          Inventory
        </NavLink>
        <NavLink to="/staff/stock-in" className="staff-nav-link">
          Stock In
        </NavLink>
        <NavLink to="/staff/stock-out" className="staff-nav-link">
          Stock Out
        </NavLink>
        <NavLink to="/staff/history" className="staff-nav-link">
          History
        </NavLink>
        <NavLink to="/staff/library" className="staff-nav-link">
          Library
        </NavLink>
      </nav>
      <div className="staff-content">{children}</div>
    </div>
  );
}

export default StaffLayout;
