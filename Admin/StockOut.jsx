import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpFromLine,
  Boxes,
  Truck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  PackageMinus,
} from "lucide-react";
import "./StockOut.css";

function StockOut() {
  const initialForm = {
    product: "",
    sku: "",
    quantity: "",
    destination: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [records, setRecords] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedStock, setSelectedStock] = useState("");

  const fetchRecords = async () => {
    try {
      const response = await fetch("http://127.0.0.1/wms-api/history.php");
      const data = await response.json();
      const stockOutOnly = data.filter((item) => item.type === "Stock Out");
      setRecords(stockOutOnly);
    } catch (error) {
      console.error("Failed to load stock out records:", error);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await fetch("http://127.0.0.1/wms-api/inventory.php");
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error("Failed to load inventory:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchInventory();
  }, []);

  const handleProductSelect = (value) => {
    const foundItem = inventory.find(
      (item) =>
        String(item.product).toLowerCase() === value.toLowerCase() ||
        String(item.sku).toLowerCase() === value.toLowerCase()
    );

    if (foundItem) {
      setFormData((prev) => ({
        ...prev,
        product: foundItem.product,
        sku: foundItem.sku,
      }));
      setSelectedStock(foundItem.qty);
    } else {
      setFormData((prev) => ({
        ...prev,
        product: value,
      }));
      setSelectedStock("");
    }

    setErrors((prev) => ({
      ...prev,
      product: "",
      sku: "",
      quantity: "",
    }));
    setSuccessMessage("");
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSuccessMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.product.trim()) newErrors.product = "Product name is required.";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required.";

    if (!formData.quantity.trim()) {
      newErrors.quantity = "Quantity is required.";
    } else if (Number(formData.quantity) <= 0 || isNaN(Number(formData.quantity))) {
      newErrors.quantity = "Enter a valid quantity.";
    }

    if (!formData.destination.trim()) {
      newErrors.destination = "Destination is required.";
    }

    const foundItem = inventory.find((item) => item.sku === formData.sku);

    if (!foundItem && formData.sku.trim()) {
      newErrors.sku = "Item not found in inventory.";
    }

    if (foundItem && Number(formData.quantity) > Number(foundItem.qty)) {
      newErrors.quantity = `Only ${foundItem.qty} items available in stock.`;
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await fetch("http://127.0.0.1/wms-api/stockout.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: formData.product,
          sku: formData.sku,
          qty: formData.quantity,
        }),
      });

      const data = await response.json();
      setSuccessMessage(data.message || "Stock out record saved successfully.");

      if (data.message === "Stock Out success") {
        setFormData(initialForm);
        setSelectedStock("");
        fetchRecords();
        fetchInventory();
      }
    } catch (error) {
      setSuccessMessage("Failed to connect to backend.");
    }
  };

  const handleReset = () => {
    setFormData(initialForm);
    setErrors({});
    setSuccessMessage("");
    setSelectedStock("");
  };

  const stats = useMemo(
    () => [
      { title: "Today’s Stock Out", value: 89, icon: ArrowUpFromLine },
      { title: "This Week", value: 567, icon: Boxes },
      { title: "This Month", value: 2134, icon: Truck },
      {
        title: "Completed Records",
        value: records.filter((item) => item.status === "Completed").length,
        icon: CheckCircle2,
      },
    ],
    [records]
  );

  return (
    <div className="stockout-page">
      <div className="stockout-header">
        <div>
          <h1>Stock Out</h1>
          <p>Process outgoing inventory and prevent stock inconsistencies</p>
        </div>
      </div>

      <div className="stockout-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.title} className="stockout-stat-card">
              <div className="stockout-stat-icon">
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

      <div className="stockout-main-grid">
        <div className="stockout-form-box">
          <div className="section-title">
            <h2>New Stock Out Entry</h2>
            <p>Ensure quantity does not exceed available stock</p>
          </div>

          {successMessage && (
            <div className="stockout-success-box">
              <CheckCircle2 size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="stockout-form">
            <div className="stockout-form-grid">
              <div className="input-group">
                <label>Product or SKU</label>
                <input
                  list="stockout-options"
                  type="text"
                  placeholder="Search product or SKU"
                  value={formData.product}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className={errors.product ? "input-error" : ""}
                />
                <datalist id="stockout-options">
                  {inventory.map((item) => (
                    <option key={item.sku} value={item.product}>
                      {item.sku}
                    </option>
                  ))}
                </datalist>
                {errors.product && <span className="error-text">{errors.product}</span>}
              </div>

              <div className="input-group">
                <label>SKU</label>
                <input
                  type="text"
                  placeholder="Auto-filled SKU"
                  value={formData.sku}
                  readOnly
                  className={errors.sku ? "input-error" : ""}
                />
                {errors.sku && <span className="error-text">{errors.sku}</span>}
              </div>

              <div className="input-group">
                <label>Available Stock</label>
                <input
                  type="text"
                  value={selectedStock}
                  readOnly
                  placeholder="Auto-filled stock"
                />
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

              <div className="input-group stockout-full-width">
                <label>Destination</label>
                <input
                  type="text"
                  placeholder="Enter destination"
                  value={formData.destination}
                  onChange={(e) => handleChange("destination", e.target.value)}
                  className={errors.destination ? "input-error" : ""}
                />
                {errors.destination && <span className="error-text">{errors.destination}</span>}
              </div>
            </div>

            <div className="stockout-form-actions">
              <button type="button" className="stockout-secondary-btn" onClick={handleReset}>
                <RotateCcw size={16} />
                Reset
              </button>

              <button type="submit" className="stockout-primary-btn">
                <PackageMinus size={16} />
                Save Record
              </button>
            </div>
          </form>
        </div>

        <div className="stockout-summary-box">
          <div className="section-title">
            <h2>Stock Safety Reminder</h2>
          </div>

          <div className="stockout-warning-box">
            <AlertTriangle size={20} />
            <p>
              Always verify available stock before processing outgoing items to prevent negative inventory.
            </p>
          </div>
        </div>
      </div>

      <div className="stockout-table-box">
        <div className="section-title">
          <h2>Recent Stock Out Records</h2>
          <p>Latest outgoing inventory transactions</p>
        </div>

        <div className="stockout-table-wrapper">
          <table className="stockout-table">
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
              {records.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.type}</td>
                  <td className="stockout-product-cell">{item.product}</td>
                  <td>{item.qty}</td>
                  <td>
                    <span className={`stockout-status ${item.status.toLowerCase()}`}>
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

export default StockOut;