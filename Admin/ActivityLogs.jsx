import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import "./ActivityLogs.css";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://127.0.0.1/wms-api/history.php");
      const data = await res.json();
      setLogs(data.reverse());
    } catch {
      console.log("error fetching logs");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="activity-page">
      <div className="activity-header">
        <div>
          <h1>Activity Logs</h1>
          <p>Track all system activities in real time</p>
        </div>
      </div>

      <div className="activity-table-box">
        <table className="activity-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>
                    <span
                      className={`activity-type ${log.type
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {log.type}
                    </span>
                  </td>
                  <td>{log.product}</td>
                  <td>{log.qty}</td>
                  <td>
                    <span
                      className={`activity-status ${log.status.toLowerCase()}`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td>{log.created_at}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  <div className="activity-empty">
                    <Clock size={28} />
                    <p>No activity yet</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ActivityLogs;