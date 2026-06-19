import { useEffect, useMemo, useState } from "react";
import { Boxes, ArrowDownToLine, ArrowUpFromLine, TriangleAlert, PackageX } from "lucide-react";
import { fetchInventory, fetchHistory } from "../utils/supabaseApi";
import "./StudentPages.css";

function StudentDashboard() {
  const [inventory, setInventory] = useState([]);
  const [history, setHistory] = useState([]);

  const loadData = async () => {
    try {
      const [inventoryData, historyData] = await Promise.all([
        fetchInventory(),
        fetchHistory(),
      ]);
      setInventory(inventoryData);
      setHistory(historyData);
    } catch (error) {
      console.error("Failed to load student dashboard data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isToday = (date) => new Date(date).toDateString() === new Date().toDateString();

  const totalProducts = inventory.length;
  const stockInToday = history.filter(
    (item) => item.type === "Stock In" && isToday(item.created_at)
  ).length;
  const stockOutToday = history.filter(
    (item) => item.type === "Stock Out" && isToday(item.created_at)
  ).length;

  const lowStockCount = inventory.filter(
    (item) => Number(item.qty) > 0 && Number(item.qty) <= 10
  ).length;

  const outOfStockCount = inventory.filter((item) => Number(item.qty) <= 0).length;

  const stats = [
    {
      title: "Available Products",
      value: totalProducts,
      icon: Boxes,
      note: "Total inventory items",
    },
    {
      title: "Stock In Today",
      value: stockInToday,
      icon: ArrowDownToLine,
      note: "Today’s received items",
    },
    {
      title: "Stock Out Today",
      value: stockOutToday,
      icon: ArrowUpFromLine,
      note: "Today’s outgoing items",
    },
    {
      title: "Low/Out of Stock",
      value: lowStockCount + outOfStockCount,
      icon: TriangleAlert,
      note: "Items requiring attention",
    },
  ];

  const recentActivity = useMemo(() => history.slice(0, 5), [history]);

  return (
    <div className="student-page">
      <div className="student-header">
        <div>
          <h1>Student Dashboard</h1>
          <p>Quick overview of inventory and recent warehouse activity.</p>
        </div>
      </div>

      <div className="student-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="student-stat-card">
              <div className="student-stat-icon">
                <Icon size={20} />
              </div>
              <div>
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
                <span>{stat.note}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="student-activity-box">
        <h2>Recent Activity</h2>
        <table className="student-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((row) => (
              <tr key={row.id}>
                <td>{row.type}</td>
                <td>{row.product}</td>
                <td>{row.qty}</td>
                <td>{row.status}</td>
              </tr>
            ))}
            {recentActivity.length === 0 && (
              <tr>
                <td colSpan="4">No recent activity yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentDashboard;
