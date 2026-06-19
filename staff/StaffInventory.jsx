import { useEffect, useMemo, useState } from "react";
import { Search, PackageX } from "lucide-react";
import "./StaffPages.css";

function StaffInventory() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      return (
        String(item.product || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(item.sku || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    });
  }, [items, searchTerm]);

  return (
    <div className="staff-page">
      <h1>Staff Inventory</h1>
      <p>Read-only inventory view for warehouse staff.</p>

      <div className="staff-search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search product or SKU"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="staff-table-wrap">
        <table className="staff-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id || item.sku}>
                  <td>{item.sku}</td>
                  <td>{item.product}</td>
                  <td>{item.qty}</td>
                  <td>{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">
                  <div className="inventory-empty-state">
                    <PackageX size={28} />
                    <h3>No matching items found</h3>
                    <p>Try another keyword.</p>
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

export default StaffInventory;