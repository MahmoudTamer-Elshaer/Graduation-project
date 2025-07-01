
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BookCard from "./BookCard";
import "../styles.css";

const API_BASE_URL = "http://app.elfar5a.com";
const USER_TOKEN = localStorage.getItem("authToken");
const ITEMS_PER_PAGE = 12;

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    let queryParams = `page=${currentPage}&page_size=${ITEMS_PER_PAGE}`;
    if (searchTerm) queryParams += `&search=${encodeURIComponent(searchTerm)}`;
    if (typeFilter) queryParams += `&topic=${encodeURIComponent(typeFilter)}`;
    if (languageFilter) queryParams += `&languages=${languageFilter}`;

    const endpoint = `/api/document/explore-gutendex?${queryParams}`;
    const fullUrl = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await axios.get(fullUrl, {
        headers: USER_TOKEN
          ? {
              Authorization: `Bearer ${USER_TOKEN}`,
              Accept: "application/json",
            }
          : { Accept: "application/json" },
      });

      if (response.data?.data) {
        const apiData = response.data.data;
        const formattedBooks = (apiData.results || []).map((apiBook) => ({
          id: apiBook.book_id || apiBook.id,
          title: apiBook.title,
          author:
            apiBook.authors && apiBook.authors.length > 0
              ? apiBook.authors.map((a) => a.name).join(", ")
              : "Unknown Author",
          imageUrl:
            apiBook.formats?.["image/jpeg"] || apiBook.cover_url || null,
          language:
            apiBook.languages && apiBook.languages.length > 0
              ? apiBook.languages.join(", ")
              : "N/A",
        }));
        setBooks(formattedBooks);
        setTotalPages(
          apiData.count > 0 ? Math.ceil(apiData.count / ITEMS_PER_PAGE) : 0
        );
      } else {
        setError("Could not parse books from API response.");
        setBooks([]);
        setTotalPages(0);
      }
    } catch (apiError) {
      let errorMessage = "Failed to fetch books.";
      if (apiError.response)
        errorMessage += ` (Status: ${apiError.response.status})`;
      else if (apiError.request) errorMessage += " (No response from server)";
      setError(errorMessage);
      setBooks([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, typeFilter, languageFilter]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="book-list-container">
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search for a book"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="filter-select"
        >
          <option value="General">Type</option>
          <option value="History">History</option>
          <option value="fiction">Fiction</option>
          <option value="Novel">Novel</option>
          <option value="Science">Science</option>
          <option value="ShortStory">Short Story</option>
          <option value="Children">Children</option>
          <option value="Poetry">Poetry</option>
          {/* زود أنواعك هنا حسب الداتا عندك */}
        </select>

        <select
          value={languageFilter}
          onChange={(e) => {
            setLanguageFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="filter-select"
        >
          <option value="">Languages</option>
          <option value="en">English</option>
          <option value="ar">Arabic</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>

      {isLoading && <p>Loading books...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!isLoading && !error && (
        <div className="book-grid">
          {books.length > 0 ? (
            books.map((book) => (
              <Link
                key={book.id}
                to={`/book/${book.id}`}
                style={{ textDecoration: "none" }}
              >
                <BookCard book={book} route="book" />
              </Link>
            ))
          ) : (
            <p>No books found.</p>
          )}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (pageNumber) =>
                pageNumber === 1 ||
                pageNumber === totalPages ||
                Math.abs(pageNumber - currentPage) < 2 ||
                (pageNumber === 2 && currentPage > 3) ||
                (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
            )
            .map((pageNumber, index, arr) => (
              <React.Fragment key={pageNumber}>
                {index > 0 && pageNumber - arr[index - 1] > 1 && (
                  <span>...</span>
                )}
                <button
                  onClick={() => handlePageChange(pageNumber)}
                  className={currentPage === pageNumber ? "active" : ""}
                >
                  {pageNumber}
                </button>
              </React.Fragment>
            ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookList;




// import React, { useState, useEffect, useCallback } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import BookCard from "./BookCard";
// import "../styles.css";

// const API_BASE_URL = "http://app.elfar5a.com";
// // const USER_TOKEN = "47|r0TAM4BIf84XsFK7avMp8GUCQ6OBDOiamXm7ZXJZ150d1f94";

// const USER_TOKEN = localStorage.getItem("authToken");
// const ITEMS_PER_PAGE = 12;

// const BookList = () => {
//   const [books, setBooks] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [languageFilter, setLanguageFilter] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchBooks = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);

//     let queryParams = `page=${currentPage}&page_size=${ITEMS_PER_PAGE}`;
//     if (searchTerm) queryParams += `&search=${encodeURIComponent(searchTerm)}`;
//     if (languageFilter) queryParams += `&languages=${languageFilter}`;

//     // const endpoint = `/api/document/explore-gutendex?${queryParams}`;
//     const endpoint = `/api/document/explore-gutendex?author_year_start=2000${queryParams}`;
//     // const endpoint = `/api/document/explore-gutendex?mime_type=application/pdf&page=1&page_size=${queryParams}`;
//     const fullUrl = `${API_BASE_URL}${endpoint}`;

//     try {
//       const response = await axios.get(fullUrl, {
//         headers: USER_TOKEN
//           ? {
//               Authorization: `Bearer ${USER_TOKEN}`,
//               Accept: "application/json",
//             }
//           : { Accept: "application/json" },
//       });

//       if (response.data?.data) {
//         const apiData = response.data.data;
//         const formattedBooks = (apiData.results || []).map((apiBook) => ({
//           id: apiBook.book_id || apiBook.id,
//           title: apiBook.title,
//           author:
//             apiBook.authors && apiBook.authors.length > 0
//               ? apiBook.authors.map((a) => a.name).join(", ")
//               : "Unknown Author",
//           imageUrl:
//             apiBook.formats?.["image/jpeg"] || apiBook.cover_url || null,
//           language:
//             apiBook.languages && apiBook.languages.length > 0
//               ? apiBook.languages.join(", ")
//               : "N/A",
//         }));
//         setBooks(formattedBooks);
//         setTotalPages(
//           apiData.count > 0 ? Math.ceil(apiData.count / ITEMS_PER_PAGE) : 0
//         );
//       } else {
//         setError("Could not parse books from API response.");
//         setBooks([]);
//         setTotalPages(0);
//       }
//     } catch (apiError) {
//       let errorMessage = "Failed to fetch books.";
//       if (apiError.response)
//         errorMessage += ` (Status: ${apiError.response.status})`;
//       else if (apiError.request) errorMessage += " (No response from server)";
//       setError(errorMessage);
//       setBooks([]);
//       setTotalPages(0);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [currentPage, searchTerm, languageFilter]);

//   useEffect(() => {
//     fetchBooks();
//   }, [fetchBooks]);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
//       setCurrentPage(newPage);
//     }
//   };

//   return (
//     <div className="book-list-container">
//       <div className="filter-bar">
//         <input
//           type="text"
//           placeholder="Search for a book or ID"
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="search-input"
//         />
//         <select className="filter-select">
//           <option value="">Type</option>
//         </select>
//         <select
//           value={languageFilter}
//           onChange={(e) => {
//             setLanguageFilter(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="filter-select"
//         >
//           <option value="">Languages</option>
//           <option value="en">English</option>
//           <option value="ar">Arabic</option>
//           <option value="es">Spanish</option>
//           <option value="fr">French</option>
//         </select>
//       </div>

//       {isLoading && <p>Loading books...</p>}
//       {error && <p style={{ color: "red" }}>Error: {error}</p>}

//       {!isLoading && !error && (
//         <div className="book-grid">
//           {books.length > 0 ? (
//             books.map((book) => (
//               <Link
//                 key={book.id}
//                 to={`/book/${book.id}`}
//                 style={{ textDecoration: "none" }}
//               >
//                 <BookCard book={book} route="book" />
//               </Link>
//             ))
//           ) : (
//             <p>No books found.</p>
//           )}
//         </div>
//       )}

//       {!isLoading && totalPages > 1 && (
//         <div className="pagination">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//           {Array.from({ length: totalPages }, (_, i) => i + 1)
//             .filter(
//               (pageNumber) =>
//                 pageNumber === 1 ||
//                 pageNumber === totalPages ||
//                 Math.abs(pageNumber - currentPage) < 2 ||
//                 (pageNumber === 2 && currentPage > 3) ||
//                 (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
//             )
//             .map((pageNumber, index, arr) => (
//               <React.Fragment key={pageNumber}>
//                 {index > 0 && pageNumber - arr[index - 1] > 1 && (
//                   <span>...</span>
//                 )}
//                 <button
//                   onClick={() => handlePageChange(pageNumber)}
//                   className={currentPage === pageNumber ? "active" : ""}
//                 >
//                   {pageNumber}
//                 </button>
//               </React.Fragment>
//             ))}
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookList;
