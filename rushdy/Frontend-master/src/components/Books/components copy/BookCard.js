// src/components/BookCard.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles.css";

const BookCard = ({ book, route }) => {
  if (!book) {
    return null;
  }

  const imageUrl = book.imageUrl || "../picture/vo cover.png";
  // صورة افتراضية أفضل قليلاً
  const defaultImageOnError =
    "https://via.placeholder.com/200x300.png?text=Load+Error";
     // صورة إذا فشل تحميل imageUrl

  return (
    // المسار لصفحة تفاصيل الكتاب، تأكد أنه متوافق مع تعريفك في App.js
    // عادة ما يكون للمفرد /book/:id وليس /books/:id
    <Link to={`/${route}/${book.id}`} className="book-card-link">
      <div className="book-card">
        <img
          src={imageUrl}
          alt={`${book.title || "Book"} cover`} // إضافة قيمة افتراضية لـ alt
          className="book-card-cover"
          onError={(e) => {
            // لمنع حلقة لا نهائية إذا فشلت الصورة الافتراضية أيضًا
            if (e.target.src !== defaultImageOnError) {
              e.target.onerror = null; // إزالة المعالج لمنع التكرار
              e.target.src = defaultImageOnError;
            }
          }}
        />
        <div className="book-card-info">
          <h3 className="book-card-title">{book.title || "Untitled Book"}</h3>
          <p className="book-card-author">{book.author || "Unknown Author"}</p>
          {book.categories &&
            Array.isArray(book.categories) &&
            book.categories.length > 0 && (
              <div className="book-card-tags">
                {book.categories.slice(0, 3).map(
                  (
                    cat,
                    index // عرض أول 3 وسوم مثلاً
                  ) => (
                    <span key={`${cat}-${index}`} className="book-card-tag">
                      {cat}
                    </span>
                  )
                )}
              </div>
            )}
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
