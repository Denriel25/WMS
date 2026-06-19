import { NavLink } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <h2>Admin Menu</h2>
        <NavLink to="/admin/dashboard" className="admin-nav-link">
          Dashboard
        </NavLink>
        <NavLink to="/admin/inventory" className="admin-nav-link">
          Inventory
        </NavLink>
        <NavLink to="/admin/stock-in" className="admin-nav-link">
          Stock In
        </NavLink>
        <NavLink to="/admin/stock-out" className="admin-nav-link">
          Stock Out
        </NavLink>
        <NavLink to="/admin/reports" className="admin-nav-link">
          Reports
        </NavLink>
        <NavLink to="/admin/notifications" className="admin-nav-link">
          Notifications
        </NavLink>
        <NavLink to="/admin/activity-logs" className="admin-nav-link">
          Activity Logs
        </NavLink>
        <NavLink to="/admin/accessibility" className="admin-nav-link">
          Accessibility
        </NavLink>
        <NavLink to="/admin/settings" className="admin-nav-link">
          Settings
        </NavLink>
        <NavLink to="/admin/library" className="admin-nav-link">
          Library
        </NavLink>
      </nav>
      <div className="admin-content">{children}</div>
    </div>
  );
}

export default AdminLayout;
