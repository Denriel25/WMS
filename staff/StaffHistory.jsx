import "./StaffPages.css";

function StaffHistory() {
  const records = [
    "Stock in request for LAP-001",
    "Stock out request for CHR-002",
    "Viewed inventory list",
  ];

  return (
    <div className="staff-page">
      <h1>Staff History</h1>
      <p>Recent staff-side activity log.</p>
      <div className="simple-list">
        {records.map((item, index) => (
          <div key={index} className="simple-card">{item}</div>
        ))}
      </div>
    </div>
  );
}

export default StaffHistory;