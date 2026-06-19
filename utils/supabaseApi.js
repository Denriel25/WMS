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

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return data.user;
}

export async function fetchBooks() {
  const { data, error } = await supabase.from("books").select("*");
  if (error) {
    throw error;
  }
  return data || [];
}

export async function fetchUserLibraryBorrowings(userId) {
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("borrowing")
    .select("*")
    .eq("student_id", userId)
    .order("borrow_date", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function borrowBook({ bookId, userId }) {
  if (!userId) {
    throw new Error("Student not authenticated.");
  }

  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("id, available_copies, total_copies, title")
    .eq("id", bookId)
    .maybeSingle();

  if (bookError) {
    throw bookError;
  }

  if (!book) {
    throw new Error("Book not found.");
  }

  const available = Number(book.available_copies ?? 0);
  if (available <= 0) {
    throw new Error("No copies available for borrowing.");
  }

  const borrowDate = new Date().toISOString().split("T")[0];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  const { error: insertError } = await supabase.from("borrowing").insert({
    student_id: userId,
    book_id: bookId,
    borrow_date: borrowDate,
    due_date: dueDate.toISOString().split("T")[0],
    status: "borrowed",
  });

  if (insertError) {
    throw insertError;
  }

  const { error: updateError } = await supabase
    .from("books")
    .update({ available_copies: available - 1 })
    .eq("id", bookId);

  if (updateError) {
    throw updateError;
  }

  return { message: "Book borrowed successfully." };
}

export async function returnBook({ borrowingId, bookId }) {
  if (!borrowingId || !bookId) {
    throw new Error("Missing borrowing or book reference.");
  }

  const { error: updateBorrowingError } = await supabase
    .from("borrowing")
    .update({
      return_date: new Date().toISOString().split("T")[0],
      status: "returned",
    })
    .eq("id", borrowingId);

  if (updateBorrowingError) {
    throw updateBorrowingError;
  }

  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("available_copies")
    .eq("id", bookId)
    .maybeSingle();

  if (bookError) {
    throw bookError;
  }

  const currentAvailable = Number(book?.available_copies ?? 0);
  const { error: updateBookError } = await supabase
    .from("books")
    .update({ available_copies: currentAvailable + 1 })
    .eq("id", bookId);

  if (updateBookError) {
    throw updateBookError;
  }

  return { message: "Book returned successfully." };
}

export async function fetchBorrowings() {
  const { data, error } = await supabase
    .from("borrowing")
    .select("*")
    .order("borrow_date", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function fetchBorrowingDetails() {
  const { data, error } = await supabase
    .from("borrowing")
    .select("*, books(*)")
    .order("borrow_date", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}
