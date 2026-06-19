import { useEffect, useMemo, useState } from "react";
import { Search, BookOpen, Clock, CheckCircle2, XCircle } from "lucide-react";
import {
  borrowBook,
  fetchBooks,
  fetchUserLibraryBorrowings,
  getCurrentUser,
  returnBook,
} from "../utils/supabaseApi";
import "./StudentPages.css";

const PLACEHOLDER_COVER =
  "https://images.unsplash.com/photo-1496104679561-38b8f5d1b74a?w=800&q=80&auto=format&fit=crop";

function formatDate(value) {
  if (!value) return "N/A";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
}

function StudentLibrary() {
  const [books, setBooks] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("title");
  const [selectedBook, setSelectedBook] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [userId, setUserId] = useState("");

  const loadLibraryData = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const user = await getCurrentUser();
      const id = user?.id || localStorage.getItem("userId");
      setUserId(id || "");

      const [booksData, borrowingsData] = await Promise.all([
        fetchBooks(),
        fetchUserLibraryBorrowings(id || localStorage.getItem("userId")),
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

  const currentBorrowedBookIds = useMemo(
    () => new Set(borrowings.filter((item) => item.status !== "returned").map((item) => item.book_id)),
    [borrowings]
  );

  const activeLoans = borrowings.filter((item) => item.status !== "returned");

  const selectedBorrowing = selectedBook
    ? borrowings.find((item) => item.book_id === selectedBook.id && item.status !== "returned")
    : null;

  const handleBorrow = async (book) => {
    if (!userId) {
      setMessage("Please sign in again to borrow books.");
      return;
    }

    if (currentBorrowedBookIds.has(book.id)) {
      setMessage("You already have this book borrowed.");
      return;
    }

    setIsActionLoading(true);
    setMessage("");

    try {
      await borrowBook({ bookId: book.id, userId });
      setMessage(`Borrowed \"${book.title}\" successfully.`);
      await loadLibraryData();
    } catch (error) {
      console.error("Borrow failed:", error);
      setMessage(error?.message || "Unable to borrow book. Please try again.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReturn = async (borrowing) => {
    if (!borrowing) return;

    setIsActionLoading(true);
    setMessage("");

    try {
      await returnBook({ borrowingId: borrowing.id, bookId: borrowing.book_id });
      setMessage("Book returned successfully.");
      await loadLibraryData();
      setSelectedBook(null);
    } catch (error) {
      console.error("Return failed:", error);
      setMessage(error?.message || "Unable to return book. Please try again.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  return (
    <div className="student-page library-page">
      <div className="student-header">
        <div>
          <h1>Library Catalog</h1>
          <p>Browse available books, borrow titles, and manage your student library account.</p>
        </div>
        <div className="library-summary">
          <div className="summary-pill">Books: {books.length}</div>
          <div className="summary-pill">Active loans: {activeLoans.length}</div>
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
          <option value="title">Sort: A–Z</option>
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
            const isBorrowed = currentBorrowedBookIds.has(book.id);
            return (
              <div key={book.id} className="book-card">
                <div className="book-card-cover" onClick={() => handleSelectBook(book)}>
                  <img src={book.cover_image || PLACEHOLDER_COVER} alt={book.title} />
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
                  <button
                    className={`borrow-button ${isBorrowed ? "borrowed" : availableCount > 0 ? "can-borrow" : "disabled"}`}
                    type="button"
                    onClick={() => handleBorrow(book)}
                    disabled={isBorrowed || availableCount <= 0 || isActionLoading}
                  >
                    {isBorrowed ? "Borrowed" : availableCount > 0 ? "Borrow" : "Unavailable"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">No books found. Try another filter or search term.</div>
        )}
      </div>

      <div className="borrow-list">
        <h2>Your Active Loans</h2>
        {activeLoans.length > 0 ? (
          <div className="loan-grid">
            {activeLoans.map((loan) => {
              const book = books.find((item) => item.id === loan.book_id) || {};
              return (
                <div className="loan-card" key={loan.id}>
                  <div className="loan-card-header">
                    <BookOpen size={18} />
                    <span>{book.title || `Book ID ${loan.book_id}`}</span>
                  </div>
                  <div className="loan-details">
                    <p>{book.author || "Unknown author"}</p>
                    <div className="loan-meta">
                      <span>
                        <Clock size={14} /> Due {formatDate(loan.due_date)}
                      </span>
                      <span>
                        <CheckCircle2 size={14} /> {loan.status}
                      </span>
                    </div>
                  </div>
                  <button
                    className="return-button"
                    type="button"
                    onClick={() => handleReturn(loan)}
                    disabled={isActionLoading}
                  >
                    Return book
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="empty-state">You have no active book loans.</p>
        )}
      </div>

      {selectedBook && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={closeModal}>
              <XCircle size={20} />
            </button>
            <div className="modal-cover">
              <img src={selectedBook.cover_image || PLACEHOLDER_COVER} alt={selectedBook.title} />
            </div>
            <div className="modal-body">
              <h3>{selectedBook.title}</h3>
              <p className="modal-subtitle">{selectedBook.author}</p>
              <div className="modal-tags">
                <span className="modal-tag">{categoryName(selectedBook)}</span>
                <span className="modal-tag">ISBN {selectedBook.isbn || "N/A"}</span>
              </div>
              <p className="modal-desc">{selectedBook.description || "No description available."}</p>
              <div className="modal-stats">
                <span>
                  Copies: <strong>{selectedBook.total_copies ?? selectedBook.available_copies ?? "—"}</strong>
                </span>
                <span>
                  Available: <strong className={Number(selectedBook.available_copies ?? selectedBook.available ?? 0) > 0 ? "avail" : "unavail"}>
                    {Number(selectedBook.available_copies ?? selectedBook.available ?? 0)}
                  </strong>
                </span>
              </div>
              <button
                className={`modal-reserve-btn ${currentBorrowedBookIds.has(selectedBook.id) ? "reserved-state" : Number(selectedBook.available_copies ?? selectedBook.available ?? 0) > 0 ? "can-reserve" : "cant-reserve"}`}
                type="button"
                onClick={() => handleBorrow(selectedBook)}
                disabled={currentBorrowedBookIds.has(selectedBook.id) || Number(selectedBook.available_copies ?? selectedBook.available ?? 0) <= 0 || isActionLoading}
              >
                {currentBorrowedBookIds.has(selectedBook.id)
                  ? "Already borrowed"
                  : Number(selectedBook.available_copies ?? selectedBook.available ?? 0) > 0
                  ? "Borrow this book"
                  : "Currently unavailable"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentLibrary;
