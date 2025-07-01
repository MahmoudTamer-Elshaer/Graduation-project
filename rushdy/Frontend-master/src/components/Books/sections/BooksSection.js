// src/components/Home/UserDocumentsSection.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import BookCard from "../components copy/BookCard";
import { useNavigate, Link, useLocation } from "react-router-dom"; //kk
const API_BASE_URL = "http://app.elfar5a.com";
const DOCS_TO_DISPLAY_IN_HOME = 5000;

function UserDocumentsSection() {
  const [userDocuments, setUserDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMoreDocs, setHasMoreDocs] = useState(false);
  const location = useLocation(); //kk
  const currentPath = location.pathname; //jj

  const isInSection = currentPath === "/"; //kk

  const navigate = useNavigate();

  const fetchUserDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setHasMoreDocs(false);

    const USER_TOKEN = localStorage.getItem("authToken");

    if (!USER_TOKEN) {
      setError("Authentication token is missing. Please log in.");
      setIsLoading(false);
      navigate("/login");
      return;
    }

    const endpoint = `/api/document/documents`;
    const fullUrl = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await axios.get(fullUrl, {
        headers: {
          Authorization: `Bearer ${USER_TOKEN}`,
          Accept: "application/json",
        },
      });

      if (response.data && Array.isArray(response.data.data)) {
        const allFetchedDocuments = response.data.data;

        // قم بتعيين المستندات المعروضة (جزء من الكل إذا لزم الأمر)
        setUserDocuments(allFetchedDocuments.slice(0, DOCS_TO_DISPLAY_IN_HOME));

        // تحقق مما إذا كان هناك المزيد من المستندات غير المعروضة حاليًا
        if (allFetchedDocuments.length > DOCS_TO_DISPLAY_IN_HOME) {
          setHasMoreDocs(true);
        } else {
          setHasMoreDocs(false);
        }
      } else {
        setError("No valid user documents found or unexpected data format.");
        setUserDocuments([]); // تأكد من أنها مصفوفة فارغة
      }
    } catch (err) {
      console.error("Error fetching user documents:", err);
      setError(err.response?.data?.message || "Error fetching your documents.");
      setUserDocuments([]); // تأكد من أنها مصفوفة فارغة عند الخطأ
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserDocuments();
  }, [fetchUserDocuments]);

  const handleShowMoreClick = () => {
    navigate("/books");
  };

  // دالة الحذف
  const handleDelete = async (bookId) => {
    const USER_TOKEN = localStorage.getItem("authToken");
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/document/document/${bookId}`, {
          headers: {
            Authorization: `Bearer ${USER_TOKEN}`,
            Accept: "application/json",
          },
        });
        setUserDocuments(userDocuments.filter((book) => book.id !== bookId));
        alert("Book deleted successfully!");
      } catch (err) {
        console.error("Delete error:", err);
        alert(
          "Failed to delete book: " +
            (err.response?.data?.message || err.message)
        );
      }
    }
  };

  if (isLoading)
    return (
      <section className="books-section-container" style={{ padding: "0px" }}>
        <div className="books-section-header">
          <h2>Books</h2>
        </div>
        <p>Loading your documents...</p>
      </section>
    );

  if (error && userDocuments.length === 0)
    return (
      <section className="books-section-container" style={{ padding: "0px" }}>
        <div className="books-section-header">
          <h2>My Books</h2>
        </div>
        <p style={{ color: "red" }}>Error: {error}</p>
      </section>
    );

  console.log("Current path:", currentPath, "isInSection:", isInSection);

  return (
    <section className="books-section-container" style={{ padding: "20px" }}>
      <div
        className="books-section-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>My Books</h1>
        <button onClick={handleShowMoreClick} className="show-more-button">
          Lexi Books<span className="arrow">➔</span>
        </button>
      </div>

      <div
        className="books-row-layout"
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "15px",
          paddingBottom: "10px",
          position: "relative",
        }}
      >
        {userDocuments.map((book) => {
          const bookCardProps = {
            id: book.id,
            title: book.title || "Untitled Document",
            author: book.author || "Unknown Author",
            imageUrl: book.cover_url || "URL_TO_YOUR_DEFAULT_COVER_IMAGE.png",
            pdfLink: book.file_url || "",
          };
          console.log("Book data:", book);
          return (
            <div
              key={book.id}
              style={{ width: "300px", flexShrink: 0, position: "relative" }}
            >
              <Link to={`/book/${book.id}`} style={{ textDecoration: "none" }}>
                <BookCard book={bookCardProps} route="user" />
              </Link>

              <button
                onClick={() => handleDelete(book.id)}
                className="delete"
                style={{
                  width: "20px",
                  padding: "2px",
                  backgroundColor: "gray",
                  color: "white",
                  borderRadius: "50px",
                  position: "absolute",
                  left: "250px",
                  bottom: "399px",
                }}
              >
                X
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default UserDocumentsSection;
