export function getInventory() {
  return JSON.parse(localStorage.getItem("inventory")) || [
    { sku: "LAP-001", product: "Dell Laptop", qty: 45 },
    { sku: "MOU-003", product: "Wireless Mouse", qty: 67 },
  ];
}

export function saveInventory(data) {
  localStorage.setItem("inventory", JSON.stringify(data));
}

export function getHistory() {
  return JSON.parse(localStorage.getItem("history")) || [];
}

export function saveHistory(data) {
  localStorage.setItem("history", JSON.stringify(data));
}