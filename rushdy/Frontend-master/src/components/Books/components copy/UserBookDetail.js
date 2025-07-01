////// تفاصيل اول صفحه
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BookCard from "./BookCard";
import "../styles.css";
import rightArrow from "../picture/arrow-right.png";
import leftArrow from "../picture/arrow-left.png";

const API_BASE_URL = "http://app.elfar5a.com";
const USER_TOKEN = localStorage.getItem("authToken");

const UserBookDetail = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const gridRef = useRef(null);

  const fetchBookDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/document/documents?id=${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${USER_TOKEN}`,
            Accept: "application/json",
            "Cache-Control": "no-cache",
          },
        }
      );
      console.log("BookDetail API Response:", response.data); // Debug
      const books = response.data.data || response.data; // التعامل مع data.data أو data مباشرة
      const apiBook = Array.isArray(books)
        ? books.find((result) => result.id === parseInt(bookId))
        : null;

      if (apiBook) {
        let fileUrl = apiBook.file_name || "";
        // تحويل المسار ليكون كامل لو كان نسبي
        if (fileUrl && !fileUrl.startsWith("http")) {
          fileUrl = `${API_BASE_URL}${fileUrl}`;
        }

        const formattedBook = {
          id: apiBook.id,
          title: apiBook.title || "Untitled",
          author: apiBook.author || "Unknown Author",
          imageUrl: apiBook.cover_url || "https://via.placeholder.com/150",
          language: "N/A",
          birthDeathYears: "Unknown",
          translators: "N/A",
          description: apiBook.description || "No description available.",
          categories: [],
          fileUrl: fileUrl,
          fileType: (() => {
            const ext = apiBook.file_name?.split(".").pop()?.toLowerCase();
            switch (ext) {
              case "pdf":
                return "application/pdf";
              case "html":
                return "text/html";
              case "txt":
                return "text/plain";
              default:
                return ext ? `application/${ext}` : "";
            }
          })(),
        };
        setBook(formattedBook);
      } else {
        setError(`Book with ID ${bookId} not found in the response.`);
      }
    } catch (err) {
      let errorMsg = "Failed to fetch book details.";
      if (err.response) errorMsg += ` (Status: ${err.response.status})`;
      else if (err.request) errorMsg += " (No response from server)";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  const fetchRelatedBooks = useCallback(async () => {
    if (!book) return;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/document/documents?page_size=4`,
        {
          headers: {
            Authorization: `Bearer ${USER_TOKEN}`,
            Accept: "application/json",
            "Cache-Control": "no-cache",
          },
        }
      );
      console.log("Related Books API Response:", response.data); // Debug
      const books = Array.isArray(response.data.data)
        ? response.data.data
        : response.data;
      setRelatedBooks(
        books
          .filter((result) => result.id !== parseInt(bookId))
          .map((apiBook) => ({
            id: apiBook.id,
            title: apiBook.title || "Untitled",
            author: apiBook.author || "Unknown Author",
            imageUrl: apiBook.cover_url || "https://via.placeholder.com/150",
            language: "N/A",
            categories: [],
          }))
      );
    } catch (err) {
      console.error("Failed to fetch related books:", err);
    }
  }, [book, bookId]);

  useEffect(() => {
    fetchBookDetails();
  }, [fetchBookDetails]);

  useEffect(() => {
    if (book) fetchRelatedBooks();
  }, [book, fetchRelatedBooks]);

  const handleReadClick = async () => {
    if (!book?.fileUrl || !book?.fileType) {
      alert(
        "No readable file available. Please check if the book supports a readable format (e.g., PDF, HTML)."
      );
      return;
    }
    console.log("Navigating to reader with:", {
      bookId,
      fileUrl: book.fileUrl,
      fileType: book.fileType,
    }); // Debug
    console.log("Going to:", `/userReader/${bookId}`);
    navigate(`/userReader/${bookId}`, {
      state: { url: book.fileUrl, type: book.fileType },
    });
  };
  // console.log(bookId)

  const scrollPrev = () =>
    gridRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollNext = () =>
    gridRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  if (loading)
    return <p className="loading-message">Loading book details...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!book) return <p>Book not found.</p>;

  return (
    <div className="book-detail-container">
      <nav className="breadcrumbs">
        <Link to="/" className="breadcrumbs-link">
          Home {">"}
        </Link>
        <Link to="/books" className="breadcrumbs-link">
          Books {">"}
        </Link>
        <span>{book.title}</span>
      </nav>

      <div className="book-detail-main">
        <div className="book-detail-cover">
          <img src={book.imageUrl} alt={`${book.title} cover`} />
        </div>
        <div className="book-detail-info">
          <h1>{book.title}</h1>
          <p>
            <strong>Author:</strong> {book.author}
          </p>
          <p>
            <strong>Birth / Death Years:</strong> {book.birthDeathYears}
          </p>
          <p>
            <strong>Language:</strong> {book.language}
          </p>
          <p>
            <strong>Translators:</strong> {book.translators}
          </p>
          <p className="book-description">{book.description}</p>
          <div className="book-detail-tags">
            {book.categories.map((cat) => (
              <span key={cat} className="book-detail-tag">
                {cat}
              </span>
            ))}
          </div>
          <button className="read-button" onClick={handleReadClick}>
            Read
          </button>
        </div>
      </div>

      <div className="related-books">
        <h3 className="r">Related Books</h3>
        <div className="related-books-slider">
          <button className="slider-arrow prev" onClick={scrollPrev}>
            <img src={rightArrow} alt="Previous" />
          </button>
          <div className="related-books-grid" ref={gridRef}>
            {relatedBooks.length > 0 ? (
              relatedBooks.map((book) => (
                <Link
                  key={book.id}
                  // to={`/book/${book.id}`}
                  style={{ textDecoration: "none", width: "300px" }}
                >
                  <BookCard book={book} route="user" />
                  {/* <BookCard book={book} route="userReader" /> */}
                </Link>
              ))
            ) : (
              <p>No related books found.</p>
            )}
          </div>
          <button className="slider-arrow next" onClick={scrollNext}>
            <img src={leftArrow} alt="Next" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserBookDetail;
