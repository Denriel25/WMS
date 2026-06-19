import { useEffect, useState } from "react";
import "./Notifications.css";

function Notifications() {
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = async () => {
    try {
      const res = await fetch("http://127.0.0.1/wms-api/inventory.php");
      const data = await res.json();

      const filtered = data.filter(
        (item) => Number(item.qty) <= 10
      );

      setAlerts(filtered);
    } catch {
      console.log("error fetching alerts");
    }
  };

  useEffect(() => {
    fetchAlerts();

    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="notifications-page">
      <h1>Notifications</h1>
      <p>Inventory alerts and warnings</p>

      <div className="notifications-list">
        {alerts.length > 0 ? (
          alerts.map((item) => (
            <div
              key={item.sku}
              className={`notification-card ${
                item.qty === 0 ? "danger" : "warning"
              }`}
            >
              <h3>{item.product}</h3>
              <p>SKU: {item.sku}</p>
              <p>
                {item.qty === 0
                  ? "Out of Stock"
                  : `Low Stock (${item.qty} left)`}
              </p>
            </div>
          ))
        ) : (
          <p>No alerts. All good ✔</p>
        )}
      </div>
    </div>
  );
}

export default Notifications;