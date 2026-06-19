import "./StaffPages.css";

function StaffDashboard() {
  return (
    <div className="staff-page">
      <h1>Staff Dashboard</h1>
      <p>View assigned tasks, stock movements, and daily warehouse updates.</p>
      <div className="staff-grid">
        <div className="staff-card">
          <h3>Assigned Stock In</h3>
          <p>12</p>
        </div>
        <div className="staff-card">
          <h3>Assigned Stock Out</h3>
          <p>9</p>
        </div>
        <div className="staff-card">
          <h3>Pending Tasks</h3>
          <p>4</p>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;