import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  Boxes,
  Truck,
  ClipboardCheck,
  Plus,
  RotateCcw,
  PackageCheck,
} from "lucide-react";
import "./StockIn.css";

function StockIn() {
  const initialForm = {
    product: "",
    sku: "",
    quantity: "",
    supplier: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [stockInRecords, setStockInRecords] = useState([]);

  const fetchRecords = async () => {
    try {
      const response = await fetch("http://127.0.0.1/wms-api/history.php");
      const data = await response.json();

      const stockInOnly = data
        .filter((item) => item.type === "Stock In")
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setStockInRecords(stockInOnly);
    } catch (error) {
      console.error("Failed to load records:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const parseQty = (qty) =>
    Math.abs(Number(String(qty).replace(/[^\d-]/g, ""))) || 0;

  const isToday = (date) => {
    const today = new Date();
    const d = new Date(date);
    return d.toDateString() === today.toDateString();
  };

  const isThisWeek = (date) => {
    const now = new Date();
    const d = new Date(date);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return d >= startOfWeek && d <= endOfWeek;
  };

  const isThisMonth = (date) => {
    const now = new Date();
    const d = new Date(date);

    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const todayCount = stockInRecords
    .filter((item) => isToday(item.created_at))
    .reduce((sum, item) => sum + parseQty(item.qty), 0);

  const weekCount = stockInRecords
    .filter((item) => isThisWeek(item.created_at))
    .reduce((sum, item) => sum + parseQty(item.qty), 0);

  const monthCount = stockInRecords
    .filter((item) => isThisMonth(item.created_at))
    .reduce((sum, item) => sum + parseQty(item.qty), 0);

  const totalRecords = stockInRecords.length;

  const completedCount = stockInRecords.filter(
    (item) => item.status === "Completed"
  ).length;

  const pendingCount = stockInRecords.filter(
    (item) => item.status === "Pending"
  ).length;

  const lastSupplier = "N/A";

  const validateForm = () => {
    const newErrors = {};

    if (!formData.product.trim()) newErrors.product = "Product name is required.";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required.";

    if (!formData.quantity.trim()) {
      newErrors.quantity = "Quantity is required.";
    } else if (Number(formData.quantity) <= 0 || isNaN(Number(formData.quantity))) {
      newErrors.quantity = "Quantity must be a valid number greater than 0.";
    }

    if (!formData.supplier.trim()) newErrors.supplier = "Supplier is required.";

    return newErrors;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await fetch("http://127.0.0.1/wms-api/stockin.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: formData.product,
          sku: formData.sku,
          qty: formData.quantity,
          supplier: formData.supplier,
        }),
      });

      const data = await response.json();
      setSuccessMessage(data.message || "Stock in record saved successfully.");

      if (data.message === "Stock In success") {
        setFormData(initialForm);
        fetchRecords();
      }
    } catch (error) {
      setSuccessMessage("Failed to connect to backend.");
    }
  };

  const handleReset = () => {
    setFormData(initialForm);
    setErrors({});
    setSuccessMessage("");
  };

  const stats = useMemo(
    () => [
      { title: "Today’s Stock In", value: todayCount, icon: ArrowDownToLine },
      { title: "This Week", value: weekCount, icon: Boxes },
      { title: "This Month", value: monthCount, icon: Truck },
      { title: "Completed Records", value: completedCount, icon: ClipboardCheck },
    ],
    [todayCount, weekCount, monthCount, completedCount]
  );

  return (
    <div className="stockin-page">
      <div className="stockin-header">
        <div>
          <h1>Stock In</h1>
          <p>Record, validate, and manage incoming inventory transactions</p>
        </div>

        <button className="stockin-primary-btn" type="button">
          <Plus size={16} />
          <span>New Stock In</span>
        </button>
      </div>

      <div className="stockin-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.title} className="stockin-stat-card">
              <div className="stockin-stat-icon">
                <Icon size={20} />
              </div>
              <div>
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="stockin-main-grid">
        <div className="stockin-form-box">
          <div className="section-title">
            <h2>New Stock In Entry</h2>
            <p>Fill in the required details before saving the transaction</p>
          </div>

          {successMessage && (
            <div className="stockin-success-box">
              <PackageCheck size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="stockin-form">
            <div className="stockin-form-grid">
              <div className="input-group">
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={formData.product}
                  onChange={(e) => handleChange("product", e.target.value)}
                  className={errors.product ? "input-error" : ""}
                />
                {errors.product && <span className="error-text">{errors.product}</span>}
              </div>

              <div className="input-group">
                <label>SKU</label>
                <input
                  type="text"
                  placeholder="Enter SKU"
                  value={formData.sku}
                  onChange={(e) => handleChange("sku", e.target.value)}
                  className={errors.sku ? "input-error" : ""}
                />
                {errors.sku && <span className="error-text">{errors.sku}</span>}
              </div>

              <div className="input-group">
                <label>Quantity</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                  className={errors.quantity ? "input-error" : ""}
                />
                {errors.quantity && <span className="error-text">{errors.quantity}</span>}
              </div>

              <div className="input-group">
                <label>Supplier</label>
                <input
                  type="text"
                  placeholder="Enter supplier name"
                  value={formData.supplier}
                  onChange={(e) => handleChange("supplier", e.target.value)}
                  className={errors.supplier ? "input-error" : ""}
                />
                {errors.supplier && <span className="error-text">{errors.supplier}</span>}
              </div>
            </div>

            <div className="stockin-form-actions">
              <button type="button" className="stockin-secondary-btn" onClick={handleReset}>
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>

              <button type="submit" className="stockin-primary-btn">
                <ArrowDownToLine size={16} />
                <span>Save Record</span>
              </button>
            </div>
          </form>
        </div>

        <div className="stockin-summary-box">
          <div className="section-title">
            <h2>Transaction Snapshot</h2>
            <p>Quick look at the current stock in activity</p>
          </div>

          <div className="stockin-summary-list">
            <div className="stockin-summary-item">
              <span>Total Records</span>
              <strong>{totalRecords}</strong>
            </div>
            <div className="stockin-summary-item">
              <span>Completed</span>
              <strong>{completedCount}</strong>
            </div>
            <div className="stockin-summary-item">
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>
            <div className="stockin-summary-item">
              <span>Last Supplier</span>
              <strong>{lastSupplier}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="stockin-table-box">
        <div className="section-title">
          <h2>Recent Stock In Records</h2>
          <p>Latest incoming inventory transactions</p>
        </div>

        <div className="stockin-table-wrapper">
          <table className="stockin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>

            <tbody>
              {stockInRecords.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.type}</td>
                  <td className="stockin-product-cell">{item.product}</td>
                  <td>{item.qty}</td>
                  <td>
                    <span className={`stockin-status ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StockIn;