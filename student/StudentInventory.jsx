import { useEffect, useMemo, useState } from "react";
import { Search, PackageX } from "lucide-react";
import { fetchInventory } from "../utils/supabaseApi";
import "./StudentPages.css";

function StudentInventory() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getStatus = (qty) => {
    const numQty = Number(qty);
    if (numQty <= 0) return "Out of Stock";
    if (numQty <= 10) return "Low Stock";
    return "In Stock";
  };

  const loadInventory = async () => {
    try {
      const data = await fetchInventory();
      setItems(
        data.map((item) => ({
          ...item,
          status: getStatus(item.qty),
        }))
      );
    } catch (error) {
      console.error("Failed to load student inventory:", error);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const term = searchTerm.toLowerCase();
      return (
        String(item.product || "").toLowerCase().includes(term) ||
        String(item.sku || "").toLowerCase().includes(term)
      );
    });
  }, [items, searchTerm]);

  return (
    <div className="student-page">
      <h1>Student Inventory</h1>
      <p>Browse current warehouse items and stock status.</p>

      <div className="student-search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search product or SKU"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="student-table-wrap">
        <table className="student-table">
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
                <tr key={item.sku || item.id}>
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

export default StudentInventory;
