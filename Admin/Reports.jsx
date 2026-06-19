import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";
import "./Reports.css";

function Reports() {
  const [inventory, setInventory] = useState([]);
  const [history, setHistory] = useState([]);

  const fetchData = async () => {
    try {
      const inventoryRes = await fetch("http://127.0.0.1/wms-api/inventory.php");
      const inventoryData = await inventoryRes.json();

      const historyRes = await fetch("http://127.0.0.1/wms-api/history.php");
      const historyData = await historyRes.json();

      setInventory(inventoryData);
      setHistory(historyData);
    } catch (error) {
      console.error("Failed to load reports data:", error);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const parseQty = (qty) =>
    Math.abs(Number(String(qty).replace(/[^\d-]/g, ""))) || 0;

  const totalMovements = history.length;

  const inventoryValue = inventory.reduce((sum, item) => {
    const price = Number(item.price || 0);
    const qty = Number(item.qty || 0);
    return sum + price * qty;
  }, 0);

  const totalQtyInInventory = inventory.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0
  );

  const totalMovedQty = history.reduce((sum, item) => sum + parseQty(item.qty), 0);

  const avgTurnover =
    totalQtyInInventory > 0
      ? (totalMovedQty / totalQtyInInventory).toFixed(1)
      : "0.0";

  const completedRecords = history.filter(
    (item) => item.status === "Completed"
  ).length;

  const accuracy =
    totalMovements > 0
      ? ((completedRecords / totalMovements) * 100).toFixed(1)
      : "100.0";

  const monthlyMap = {
    Jan: { month: "Jan", stockIn: 0, stockOut: 0 },
    Feb: { month: "Feb", stockIn: 0, stockOut: 0 },
    Mar: { month: "Mar", stockIn: 0, stockOut: 0 },
    Apr: { month: "Apr", stockIn: 0, stockOut: 0 },
    May: { month: "May", stockIn: 0, stockOut: 0 },
    Jun: { month: "Jun", stockIn: 0, stockOut: 0 },
    Jul: { month: "Jul", stockIn: 0, stockOut: 0 },
    Aug: { month: "Aug", stockIn: 0, stockOut: 0 },
    Sep: { month: "Sep", stockIn: 0, stockOut: 0 },
    Oct: { month: "Oct", stockIn: 0, stockOut: 0 },
    Nov: { month: "Nov", stockIn: 0, stockOut: 0 },
    Dec: { month: "Dec", stockIn: 0, stockOut: 0 },
  };

  history.forEach((item) => {
    const date = new Date(item.created_at);
    const monthKey = date.toLocaleString("en-US", { month: "short" });

    if (!monthlyMap[monthKey]) return;

    if (item.type === "Stock In") {
      monthlyMap[monthKey].stockIn += parseQty(item.qty);
    }

    if (item.type === "Stock Out") {
      monthlyMap[monthKey].stockOut += parseQty(item.qty);
    }
  });

  const chartData = useMemo(() => Object.values(monthlyMap), [history]);

  const lowStockCount = inventory.filter(
    (item) => Number(item.qty) > 0 && Number(item.qty) <= 10
  ).length;

  const outOfStockCount = inventory.filter(
    (item) => Number(item.qty) <= 0
  ).length;

  const stockInCount = history.filter((item) => item.type === "Stock In").length;
  const stockOutCount = history.filter((item) => item.type === "Stock Out").length;

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>Live warehouse insights based on inventory and transaction history</p>
        </div>
      </div>

      <div className="reports-cards">
        <div className="reports-card">
          <h3>{totalMovements}</h3>
          <p>Total Movements</p>
        </div>

        <div className="reports-card">
          <h3>₱{inventoryValue.toLocaleString()}</h3>
          <p>Inventory Value</p>
        </div>

        <div className="reports-card">
          <h3>{avgTurnover}x</h3>
          <p>Avg. Turnover</p>
        </div>

        <div className="reports-card">
          <h3>{accuracy}%</h3>
          <p>Accuracy</p>
        </div>
      </div>

      <div className="reports-charts">
        <div className="reports-chart-box large">
          <h3>Stock Movement</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="#9d96b8" />
              <YAxis stroke="#9d96b8" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="stockIn"
                stroke="#a14cf5"
                strokeWidth={3}
                name="Stock In"
              />
              <Line
                type="monotone"
                dataKey="stockOut"
                stroke="#4a86ff"
                strokeWidth={3}
                name="Stock Out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="reports-chart-box small">
          <h3>Monthly Comparison</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="#9d96b8" />
              <YAxis stroke="#9d96b8" />
              <Tooltip />
              <Legend />
              <Bar dataKey="stockIn" fill="#a14cf5" name="Stock In" radius={[6, 6, 0, 0]} />
              <Bar dataKey="stockOut" fill="#4a86ff" name="Stock Out" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="reports-bottom-grid">
        <div className="reports-summary-box">
          <h3>Inventory Summary</h3>

          <div className="reports-summary-list">
            <div className="reports-summary-item">
              <span>Low Stock Items</span>
              <strong>{lowStockCount}</strong>
            </div>
            <div className="reports-summary-item">
              <span>Out of Stock Items</span>
              <strong>{outOfStockCount}</strong>
            </div>
            <div className="reports-summary-item">
              <span>Total Inventory Qty</span>
              <strong>{totalQtyInInventory}</strong>
            </div>
          </div>
        </div>

        <div className="reports-summary-box">
          <h3>Movement Summary</h3>

          <div className="reports-summary-list">
            <div className="reports-summary-item">
              <span>Stock In Records</span>
              <strong>{stockInCount}</strong>
            </div>
            <div className="reports-summary-item">
              <span>Stock Out Records</span>
              <strong>{stockOutCount}</strong>
            </div>
            <div className="reports-summary-item">
              <span>Completed Records</span>
              <strong>{completedRecords}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;