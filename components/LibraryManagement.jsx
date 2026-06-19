import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Clock,
  CheckCircle2,
  RefreshCcw,
  Users,
  BookOpen,
} from "lucide-react";
import {
  fetchBooks,
  fetchBorrowingDetails,
  returnBook,
} from "../utils/supabaseApi";
import "../student/StudentPages.css";

function formatFriendlyDate(value) {
  if (!value) return "N/A";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
}

function LibraryManagement({ role }) {
  const [books, setBooks] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("title");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const loadLibraryData = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const [booksData, borrowingsData] = await Promise.all([
        fetchBooks(),
        fetchBorrowingDetails(),
      ]);
      setBooks(booksData);
      setBorrowings(borrowingsData);
    } catch (error) {
      console.error("Failed to load library data:", error);
      setMessage("Unable to load library information. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLibraryData();
  }, []);

  const categoryName = (book) => book.category || book.category_name || book.genre || "General";

  const categories = useMemo(() => {
    const unique = new Set(books.map((book) => categoryName(book)));
    return ["All", ...Array.from(unique)];
  }, [books]);

  const filteredBooks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return books
      .filter((book) => {
        const field = `${book.title || ""} ${book.author || ""}`.toLowerCase();
        const category = categoryName(book).toLowerCase();
        const matchesSearch = !query || field.includes(query);
        const matchesCategory = activeCategory === "All" || category === activeCategory.toLowerCase();
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "rating") {
          return Number(b.rating || 0) - Number(a.rating || 0);
        }
        if (sortBy === "available") {
          return (
            Number((b.available_copies ?? b.available ?? 0)) -
            Number((a.available_copies ?? a.available ?? 0))
          );
        }
        return String(a.title || "").localeCompare(String(b.title || ""));
      });
  }, [books, searchTerm, activeCategory, sortBy]);

  const activeLoans = borrowings.filter((item) => item.status !== "returned");
  const overdueLoans = activeLoans.filter((item) => {
    if (!item.due_date) return false;
    return new Date(item.due_date) < new Date();
  });

  const handleReturn = async (borrowing) => {
    if (!borrowing) return;
    setIsActionLoading(true);
    setMessage("");

    try {
      await returnBook({
        borrowingId: borrowing.id,
        bookId: borrowing.book_id || borrowing.book?.id,
      });
      setMessage("Book returned successfully.");
      await loadLibraryData();
    } catch (error) {
      console.error("Return failed:", error);
      setMessage(error?.message || "Unable to update loan. Please try again.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const pageTitle = role === "admin" ? "Library Management" : "Library Assistance";
  const pageDescription =
    role === "admin"
      ? "Manage the overall book catalog, review active borrowings, and monitor library activity."
      : "Assist borrowers, review loan details, and keep the library catalog up to date.";

  return (
    <div className="student-page library-page">
      <div className="student-header">
        <div>
          <h1>{pageTitle}</h1>
          <p>{pageDescription}</p>
        </div>
        <div className="library-summary">
          <div className="summary-pill">Total books: {books.length}</div>
          <div className="summary-pill">Active loans: {activeLoans.length}</div>
          <div className="summary-pill">Overdue: {overdueLoans.length}</div>
        </div>
      </div>

      {message && <div className="library-message">{message}</div>}

      <div className="library-toolbar">
        <div className="search-wrap">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by title or author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="title">Sort: Title</option>
          <option value="rating">Sort: Rating</option>
          <option value="available">Sort: Available</option>
        </select>
      </div>

      <div className="category-row">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-chip ${category === activeCategory ? "active" : ""}`}
            onClick={() => setActiveCategory(category)}
            type="button"
          >
            {category}
          </button>
        ))}
        <div className="cat-count">{filteredBooks.length} books</div>
      </div>

      <div className="book-grid">
        {isLoading ? (
          <div className="empty-state">Loading library catalog...</div>
        ) : filteredBooks.length > 0 ? (
          filteredBooks.map((book) => {
            const availableCount = Number(book.available_copies ?? book.available ?? 0);
            return (
              <div key={book.id} className="book-card">
                <div className="book-card-cover">
                  <img src={book.cover_image || "https://images.unsplash.com/photo-1496104679561-38b8f5d1b74a?w=800&q=80&auto=format&fit=crop"} alt={book.title} />
                  <div className={`book-badge ${availableCount > 0 ? "ok" : "no"}`}>
                    {availableCount > 0 ? `${availableCount} available` : "Unavailable"}
                  </div>
                </div>
                <div className="book-card-body">
                  <div>
                    <p className="book-title">{book.title}</p>
                    <p className="book-author">{book.author}</p>
                  </div>
                  <div className="book-meta">
                    <span>{categoryName(book)}</span>
                    <span>{Number(book.rating || 0).toFixed(1)} ★</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">No books found. Try another filter or search term.</div>
        )}
      </div>

      <div className="borrow-list">
        <div className="student-card-header">
          <div>
            <h2>Active Loans</h2>
            <p className="modal-subtitle">Track borrowed books and process returns.</p>
          </div>
          <button
            className="student-secondary-btn"
            type="button"
            onClick={loadLibraryData}
            disabled={isActionLoading}
          >
            <RefreshCcw size={16} style={{ marginRight: 8 }} /> Refresh
          </button>
        </div>

        {activeLoans.length > 0 ? (
          <div className="table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Borrower</th>
                  <th>Book</th>
                  <th>Borrowed</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {borrowings.map((loan) => {
                  const book = loan.book || loan.books || {};
                  const borrower = loan.user_email || loan.user_id || "Unknown";
                  return (
                    <tr key={loan.id}>
                      <td>{borrower}</td>
                      <td>{book.title || `ID ${loan.book_id}`}</td>
                      <td>{formatFriendlyDate(loan.borrow_date)}</td>
                      <td>{formatFriendlyDate(loan.due_date)}</td>
                      <td>{loan.status || "Pending"}</td>
                      <td>
                        {loan.status !== "returned" ? (
                          <button
                            className="return-button"
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => handleReturn(loan)}
                          >
                            Mark returned
                          </button>
                        ) : (
                          <span className="dashboard-status completed">Returned</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-state">No active loans at the moment.</p>
        )}
      </div>
    </div>
  );
}

export default LibraryManagement;
