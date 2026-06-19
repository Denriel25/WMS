import { useEffect, useMemo, useState } from "react";
import {
  Boxes,
  ArrowDownToLine,
  ArrowUpFromLine,
  PhilippinePeso,
  TriangleAlert,
  PackageX,
  Clock3,
  CheckCircle2,
  Truck,
  Plus,
  FileText,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [inventory, setInventory] = useState([]);
  const [history, setHistory] = useState([]);

  const fetchInventory = async () => {
    try {
      const response = await fetch("http://127.0.0.1/wms-api/inventory.php");
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error("Failed to load inventory:", error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://127.0.0.1/wms-api/history.php");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchHistory();

    const interval = setInterval(() => {
      fetchInventory();
      fetchHistory();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const isToday = (date) =>
    new Date(date).toDateString() === new Date().toDateString();

  const totalProducts = inventory.length;

  const stockInToday = history.filter(
    (item) => item.type === "Stock In" && isToday(item.created_at)
  ).length;

  const stockOutToday = history.filter(
    (item) => item.type === "Stock Out" && isToday(item.created_at)
  ).length;

  const totalValue = inventory.reduce((sum, item) => {
    const price = Number(String(item.price || 0).replace(/[₱,]/g, ""));
    const qty = Number(item.qty || 0);
    return sum + price * qty;
  }, 0);

  const lowStockItems = inventory.filter(
    (item) => Number(item.qty) > 0 && Number(item.qty) <= 10
  );

  const outOfStockItems = inventory.filter(
    (item) => Number(item.qty) <= 0
  );

  const pendingMovements = history.filter(
    (item) => item.status === "Pending"
  );

  const completedToday = history.filter(
    (item) => item.status === "Completed" && isToday(item.created_at)
  );

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Boxes,
      note: "Live inventory count",
    },
    {
      title: "Stock In Today",
      value: stockInToday,
      icon: ArrowDownToLine,
      note: "Today’s recorded stock in",
    },
    {
      title: "Stock Out Today",
      value: stockOutToday,
      icon: ArrowUpFromLine,
      note: "Today’s recorded stock out",
    },
    {
      title: "Total Value",
      value: `₱${totalValue.toLocaleString()}`,
      icon: PhilippinePeso,
      note: "Based on inventory price x qty",
    },
  ];

  const summaries = [
    {
      label: "Low Stock Items",
      value: lowStockItems.length,
      icon: TriangleAlert,
      variant: "warning",
    },
    {
      label: "Out of Stock Items",
      value: outOfStockItems.length,
      icon: PackageX,
      variant: "danger",
    },
    {
      label: "Pending Movements",
      value: pendingMovements.length,
      icon: Clock3,
      variant: "neutral",
    },
    {
      label: "Completed Today",
      value: completedToday.length,
      icon: CheckCircle2,
      variant: "success",
    },
    {
      label: "Suppliers Active",
      value: "N/A",
      icon: Truck,
      variant: "info",
    },
    {
      label: "Restock Requests",
      value: lowStockItems.length,
      icon: Bell,
      variant: "purple",
    },
  ];

  const quickActions = [
    {
      label: "Add Item",
      icon: Plus,
      onClick: () => navigate("/admin/inventory"),
    },
    {
      label: "New Stock In",
      icon: ArrowDownToLine,
      onClick: () => navigate("/admin/stock-in"),
    },
    {
      label: "New Stock Out",
      icon: ArrowUpFromLine,
      onClick: () => navigate("/admin/stock-out"),
    },
    {
      label: "View Reports",
      icon: FileText,
      onClick: () => navigate("/admin/reports"),
    },
  ];

  const recentActivity = useMemo(() => history.slice(0, 5), [history]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of warehouse performance, inventory flow, and active alerts</p>
        </div>

        <div className="quick-actions">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.label}
                className="quick-action-btn"
                onClick={action.onClick}
              >
                <Icon size={16} />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="dashboard-alert-strip">
        <div className="alert-card warning">
          <TriangleAlert size={18} />
          <span>{lowStockItems.length} items are running low and may need restocking soon.</span>
        </div>

        <div className="alert-card danger">
          <PackageX size={18} />
          <span>{outOfStockItems.length} products are already out of stock.</span>
        </div>
      </div>

      <div className="dashboard-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.title} className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon">
                  <Icon size={20} />
                </div>
                <span className="stat-title">{stat.title}</span>
              </div>

              <h3>{stat.value}</h3>
              <p>{stat.note}</p>
            </div>
          );
        })}
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-panel table-panel">
          <div className="panel-title">
            <h2>Recent Activity</h2>
            <p>Latest warehouse updates and inventory movements</p>
          </div>

          <div className="table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Activity</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentActivity.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.type}</td>
                    <td>{row.product}</td>
                    <td>{row.qty}</td>
                    <td>
                      <span
                        className={`dashboard-status ${
                          row.status === "Completed" ? "completed" : "pending"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {recentActivity.length === 0 && (
                  <tr>
                    <td colSpan="5">No recent activity found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-panel summary-panel">
          <div className="panel-title">
            <h2>Quick Summary</h2>
            <p>Warehouse overview for today</p>
          </div>

          <div className="dashboard-summary-list">
            {summaries.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className={`dashboard-summary-item ${item.variant}`}>
                  <div className="summary-left">
                    <div className="summary-icon">
                      <Icon size={18} />
                    </div>
                    <span>{item.label}</span>
                  </div>

                  <strong>{item.value}</strong>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;