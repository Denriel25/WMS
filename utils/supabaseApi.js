import { supabase } from "../supabaseClient";

export async function fetchInventory() {
  const { data, error } = await supabase.from("inventory").select("*");
  if (error) {
    throw error;
  }
  return data || [];
}

export async function fetchHistory() {
  const { data, error } = await supabase
    .from("history")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return data || [];
}

export async function getInventoryItemBySku(sku) {
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("sku", sku)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function saveStockIn({ product, sku, qty, supplier }) {
  const quantity = Number(qty);
  if (!product || !sku || quantity <= 0) {
    throw new Error("Invalid stock in details");
  }

  const { data: existing, error: existingError } = await supabase
    .from("inventory")
    .select("qty")
    .eq("sku", sku)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  const updatedQty = existing ? Number(existing.qty || 0) + quantity : quantity;

  const inventoryResponse = existing
    ? await supabase.from("inventory").update({ qty: updatedQty, product }).eq("sku", sku)
    : await supabase.from("inventory").insert({ sku, product, qty: updatedQty });

  if (inventoryResponse.error) {
    throw inventoryResponse.error;
  }

  const historyResponse = await supabase.from("history").insert([
    {
      type: "Stock In",
      product,
      qty: `+${quantity}`,
      status: "Completed",
      supplier: supplier || null,
    },
  ]);

  if (historyResponse.error) {
    throw historyResponse.error;
  }

  return { message: "Stock In success" };
}

export async function saveStockOut({ product, sku, qty }) {
  const quantity = Number(qty);
  if (!product || !sku || quantity <= 0) {
    throw new Error("Invalid stock out details");
  }

  const { data: existing, error: existingError } = await supabase
    .from("inventory")
    .select("qty")
    .eq("sku", sku)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (!existing) {
    throw new Error("Item not found");
  }

  const currentQty = Number(existing.qty || 0);
  if (currentQty < quantity) {
    throw new Error("Not enough stock");
  }

  const inventoryResponse = await supabase
    .from("inventory")
    .update({ qty: currentQty - quantity })
    .eq("sku", sku);

  if (inventoryResponse.error) {
    throw inventoryResponse.error;
  }

  const historyResponse = await supabase.from("history").insert([
    {
      type: "Stock Out",
      product,
      qty: `-${quantity}`,
      status: "Completed",
    },
  ]);

  if (historyResponse.error) {
    throw historyResponse.error;
  }

  return { message: "Stock Out success" };
}
