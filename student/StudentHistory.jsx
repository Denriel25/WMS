import { useEffect, useState } from "react";
import { fetchHistory } from "../utils/supabaseApi";
import "./StudentPages.css";

function StudentHistory() {
  const [logs, setLogs] = useState([]);

  const loadLogs = async () => {
    try {
      const data = await fetchHistory();
      setLogs(data);
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="student-page">
      <h1>Student History</h1>
      <p>Review recent warehouse activity and stock movements.</p>

      <div className="student-simple-list">
        {logs.length > 0 ? (
          logs.map((log) => (
            <div key={log.id} className="student-card">
              <div className="student-card-header">
                <span>{log.type}</span>
                <strong>{log.status}</strong>
              </div>
              <p>{log.product}</p>
              <small>{log.qty}</small>
              <small>{new Date(log.created_at).toLocaleString()}</small>
            </div>
          ))
        ) : (
          <p>No history records available.</p>
        )}
      </div>
    </div>
  );
}

export default StudentHistory;
