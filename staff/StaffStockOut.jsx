import { useEffect, useState } from "react";
import "./StaffPages.css";

function StaffStockOut() {
  const initialForm = {
    product: "",
    sku: "",
    quantity: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [inventory, setInventory] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedStock, setSelectedStock] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const fetchInventory = async () => {
    const res = await fetch("http://127.0.0.1/wms-api/inventory.php");
    const data = await res.json();
    setInventory(data);
  };

  const fetchRecords = async () => {
    const res = await fetch("http://127.0.0.1/wms-api/history.php");
    const data = await res.json();
    const filtered = data.filter((item) => item.type === "Stock Out");
    setRecords(filtered);
  };

  useEffect(() => {
    fetchInventory();
    fetchRecords();
  }, []);

  const handleSelect = (value) => {
    const found = inventory.find(
      (item) =>
        item.product.toLowerCase() === value.toLowerCase() ||
        item.sku.toLowerCase() === value.toLowerCase()
    );

    if (found) {
      setFormData({
        product: found.product,
        sku: found.sku,
        quantity: "",
      });
      setSelectedStock(found.qty);
    } else {
      setFormData((prev) => ({ ...prev, product: value }));
      setSelectedStock("");
    }

    setErrors({});
    setMessage("");
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setMessage("");
  };

  const validate = () => {
    const err = {};

    if (!formData.product) err.product = "Required";
    if (!formData.sku) err.sku = "Required";

    if (!formData.quantity) {
      err.quantity = "Required";
    } else if (formData.quantity <= 0) {
      err.quantity = "Invalid";
    } else if (formData.quantity > selectedStock) {
      err.quantity = "Not enough stock";
    }

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    setErrors(err);

    if (Object.keys(err).length > 0) return;

    try {
      const res = await fetch("http://127.0.0.1/wms-api/stockout.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          product: formData.product,
          sku: formData.sku,
          qty: formData.quantity
        })
      });

      const data = await res.json();
      setMessage(data.message);

      if (data.message === "Stock Out success") {
        setFormData(initialForm);
        setSelectedStock("");
        fetchInventory();
        fetchRecords();
      }
    } catch {
      setMessage("Error connecting to server");
    }
  };

  return (
    <div className="staff-page">
      <h1>Stock Out (Staff)</h1>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit} className="staff-form">
        <input
          list="items"
          placeholder="Search product or SKU"
          value={formData.product}
          onChange={(e) => handleSelect(e.target.value)}
        />

        <datalist id="items">
          {inventory.map((item) => (
            <option key={item.sku} value={item.product}>
              {item.sku}
            </option>
          ))}
        </datalist>

        <input value={formData.sku} readOnly placeholder="SKU" />

        <input
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(e) => handleChange("quantity", e.target.value)}
        />

        <p>Available Stock: {selectedStock}</p>

        <button type="submit">Confirm Stock Out</button>
      </form>

      <h2>Recent Activity</h2>

      <table className="staff-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.product}</td>
              <td>{r.qty}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StaffStockOut;