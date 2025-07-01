import React from 'react';

// تأكد من أن مسارات الصور صحيحة أو قم بتمريرها كـ props
// import defaultCover from '../assets/default-cover.png'; // صورة احتياطية

function BookCard({ title, author, imageUrl }) {
  return (
    <div className="book-card">
      <img src={imageUrl /*|| defaultCover*/} alt={`Cover of ${title}`} />
      <h4>{title}</h4>
      <p>{author}</p>
    </div>
  );
}

export default BookCard;