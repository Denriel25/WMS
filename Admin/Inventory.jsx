import { useEffect, useMemo, useState } from "react";
import {
  Package,
  TriangleAlert,
  PackageX,
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import "./Inventory.css";

function Inventory() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const getStatus = (qty) => {
    const numQty = Number(qty);

    if (numQty <= 0) return "Out of Stock";
    if (numQty <= 10) return "Low Stock";
    return "In Stock";
  };

  const fetchInventory = async () => {
    try {
      const response = await fetch("http://127.0.0.1/wms-api/inventory.php");
      const data = await response.json();

      const formattedData = data.map((item) => ({
        ...item,
        category: item.category || "General",
        price: item.price || "N/A",
        status: getStatus(item.qty),
      }));

      setItems(formattedData);
    } catch (error) {
      console.error("Failed to load inventory:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const categories = ["All", ...new Set(items.map((item) => item.category))];
  const statuses = ["All", "In Stock", "Low Stock", "Out of Stock"];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        String(item.product || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(item.sku || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(item.category || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, searchTerm, categoryFilter, statusFilter]);

  const handleAddItem = () => {
    alert("Use Stock In to add a new inventory item.");
  };

  const handleView = (sku) => {
    alert(`Viewing ${sku}`);
  };

  const handleEdit = (sku) => {
    alert(`Edit for ${sku} can be added next.`);
  };

  const handleDelete = (sku) => {
    alert(`Delete for ${sku} can be added next.`);
  };

  const totalItems = items.length;
  const inStockCount = items.filter((item) => item.status === "In Stock").length;
  const lowStockCount = items.filter((item) => item.status === "Low Stock").length;
  const outOfStockCount = items.filter(
    (item) => item.status === "Out of Stock"
  ).length;

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <div>
          <h1>Inventory</h1>
          <p>Manage, search, and monitor all warehouse items in one place</p>
        </div>

        <div className="inventory-header-actions">
          <button className="inventory-secondary-btn">
            <Filter size={16} />
            <span>Advanced Filter</span>
          </button>

          <button className="inventory-primary-btn" onClick={handleAddItem}>
            <Plus size={16} />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      <div className="inventory-stats-grid">
        <div className="inventory-stat-card">
          <div className="inventory-stat-icon">
            <Package size={20} />
          </div>
          <div>
            <h3>{totalItems}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon success">
            <Package size={20} />
          </div>
          <div>
            <h3>{inStockCount}</h3>
            <p>In Stock</p>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon warning">
            <TriangleAlert size={20} />
          </div>
          <div>
            <h3>{lowStockCount}</h3>
            <p>Low Stock</p>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon danger">
            <PackageX size={20} />
          </div>
          <div>
            <h3>{outOfStockCount}</h3>
            <p>Out of Stock</p>
          </div>
        </div>
      </div>

      <div className="inventory-toolbar">
        <div className="inventory-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by product, SKU, or category"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="inventory-filters">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="inventory-table-box">
        <div className="inventory-table-header">
          <div>
            <h2>Item List</h2>
            <p>{filteredItems.length} item(s) found</p>
          </div>
        </div>

        <div className="inventory-table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id || item.sku}>
                    <td>{item.sku}</td>
                    <td className="product-name-cell">{item.product}</td>
                    <td>{item.category}</td>
                    <td>{item.qty}</td>
                    <td>{item.price}</td>
                    <td>
                      <span
                        className={`inventory-status ${item.status
                          .toLowerCase()
                          .replace(/\s/g, "-")}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="inventory-action-buttons">
                        <button
                          className="table-action-btn"
                          title="View"
                          onClick={() => handleView(item.sku)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="table-action-btn"
                          title="Edit"
                          onClick={() => handleEdit(item.sku)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="table-action-btn delete"
                          title="Delete"
                          onClick={() => handleDelete(item.sku)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="inventory-empty-state">
                      <PackageX size={28} />
                      <h3>No matching items found</h3>
                      <p>Try changing your search or filter selection.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Inventory;