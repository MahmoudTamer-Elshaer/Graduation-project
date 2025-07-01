// // src/components/Books/pages/UserReader.js

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useLocation, Link, useParams } from "react-router-dom";
// import axios from "axios";
// import voice from "../components/assetes/volume.png";
// import "../styles.css";

// const API_BASE_URL = "http://app.elfar5a.com";
// const USER_TOKEN = localStorage.getItem("authToken");

// const UserReader = () => {
//   const { bookId } = useParams();
//   const location = useLocation();

//   const [bookData, setBookData] = useState(null);
//   const [content, setContent] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [tooltip, setTooltip] = useState({
//     visible: false,
//     x: 0,
//     y: 0,
//     selectedText: "",
//     translation: "",
//   });

//   const contentRef = useRef(null);
//   const initialBookTitle = location.state?.bookTitle || "Book Title";

//   // ⚡ تحميل محتوى الكتاب
//   const handlePreviewBook = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);
//     setContent("");

//     try {
//       const res = await axios.post(
//         `${API_BASE_URL}/api/document/preview-gutendexBook`,
//         { book_id: bookId },
//         { headers: USER_TOKEN ? { Authorization: `Bearer ${USER_TOKEN}` } : {} }
//       );

//       const data = res.data?.data;
//       setBookData(data);

//       const fileUrl = data?.file_url;
//       if (!fileUrl) throw new Error("لم يتم العثور على رابط الملف.");

//       const fileRes = await axios.get(fileUrl, { headers: { Accept: "text/html" } });
//       setContent(fileRes.data);
//     } catch (err) {
//       console.error("Error fetching book:", err);
//       setError(
//         "حدث خطأ أثناء تحميل الكتاب: " + (err.response?.data?.message || err.message)
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   }, [bookId]);

//   useEffect(() => {
//     if (bookId) handlePreviewBook();
//   }, [bookId, handlePreviewBook]);

//   // ⚡ تحديد النص وترجمته
//   const handleTextSelection = async () => {
//     const selection = window.getSelection();
//     const selectedText = selection.toString().trim();

//     if (selectedText.length > 0 && contentRef.current) {
//       const range = selection.getRangeAt(0);
//       const rect = range.getBoundingClientRect();
//       const containerRect = contentRef.current.getBoundingClientRect();
//       const x = rect.left - containerRect.left + rect.width / 2;
//       const y = rect.top - containerRect.top + contentRef.current.scrollTop - 40;

//       try {
//         const formData = new FormData();
//         formData.append("text", selectedText);
//         formData.append("target", "ar");

//         // const res = await axios.post(
//         //   `${API_BASE_URL}/api/translate/translate`,
//         //   formData,
//         //   {
//         //     headers: {
//         //       ...(USER_TOKEN && { Authorization: `Bearer ${USER_TOKEN}` }),
//         //       "Content-Type": "multipart/form-data",
//         //     },
//         //   }
//         // );

//         // const translatedWord = res.data.translation || "لم يتم العثور على ترجمة";

//         setTooltip({
//           visible: true,
//           x,
//           y,
//           selectedText,
//         //   translation: translatedWord,
//         });
//       } catch (err) {
//         console.error("Translation API error:", err);
//         setTooltip({
//           visible: true,
//           x,
//           y,
//           selectedText,
//           translation: "فشل الترجمة",
//         });
//       }
//     } else {
//       setTooltip((prev) => ({ ...prev, visible: false }));
//     }
//   };

//   // ⚡ إخفاء Tooltip عند النقر خارجاً
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (tooltip.visible && !event.target.closest("#reader-tooltip")) {
//         setTooltip((prev) => ({ ...prev, visible: false }));
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [tooltip.visible]);

//   // ⚡ إضافة الكتاب للبروفايل
//   const handleAddMyProfile = async () => {
//     try {
//       await axios.post(
//         `${API_BASE_URL}/api/document/import-gutendexbook`,
//         {
//           book_id: bookId,
//           title: bookData?.title || initialBookTitle,
//           format: "text/html",
//         },
//         { headers: { Authorization: `Bearer ${USER_TOKEN}` } }
//       );
//       alert("تم إضافة الكتاب إلى بروفايلك بنجاح!");
//     } catch (err) {
//       alert(
//         "فشل الإضافة: " + (err.response?.data?.message || err.message)
//       );
//     }
//   };

//   return (
//     <div className="reader-page-container">
//       <nav className="reader-breadcrumbs">
//         <Link to="/">Home</Link> <span>/</span>
//         <Link to="/books">Books</Link> <span>/</span>{" "}
//         {bookData?.title || initialBookTitle}
//       </nav>

//       <main className="reader-main-content">
//         {/* 🔹 رأس الصفحة */}
//         {!isLoading && bookData && (
//           <header className="reader-header">
//             <div className="reader-header-info">
//               <h2>{bookData.title}</h2>
//               {bookData.authors?.length > 0 && (
//                 <p className="author-name">
//                   by {bookData.authors.map((a) => a.name).join(", ")}
//                 </p>
//               )}
//               <div className="reader-header-buttons">
//                 <button onClick={handleAddMyProfile} className="action-button-primary">
//                   Add to My Profile
//                 </button>
//                 {bookData.file_url && (
//                   <a
//                     href={bookData.file_url}
//                     download
//                     className="action-button-secondary"
//                   >
//                     Download
//                   </a>
//                 )}
//               </div>
//             </div>
//           </header>
//         )}

//         {/* 🔹 المحتوى */}
//         <section
//           ref={contentRef}
//           className="reader-content-column"
//           onMouseUp={handleTextSelection}
//         >
//           {/* Tooltip */}
//           {tooltip.visible && (
//             <div
//               id="reader-tooltip"
//               style={{
//                 position: "absolute",
//                 left: `${tooltip.x}px`,
//                 top: `${tooltip.y}px`,
//                 transform: "translateX(-50%)",
//                 background: "#fff",
//                 border: "1px solid #ddd",
//                 borderRadius: "8px",
//                 padding: "12px",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//                 zIndex: 10,
//               }}
//             >
//               <h4>{tooltip.selectedText}</h4>
//               <p>{tooltip.translation}</p>
//               <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
//                 <button
//                   onClick={() => {
//                     const utterance = new SpeechSynthesisUtterance(
//                       tooltip.selectedText
//                     );
//                     speechSynthesis.speak(utterance);
//                   }}
//                 >
//                   <img src={voice} alt="Listen" style={{ width: "20px" }} />
//                 </button>
//                 <button onClick={() => alert(`Saved: ${tooltip.selectedText}`)}>
//                   Save
//                 </button>
//               </div>
//             </div>
//           )}

//           {isLoading && <p>جاري تحميل المحتوى...</p>}
//           {error && <p style={{ color: "red" }}>{error}</p>}
//           {!isLoading && !error && content && (
//             <div dangerouslySetInnerHTML={{ __html: content }} />
//           )}
//           {!isLoading && !error && !content && (
//             <p>لا يوجد محتوى متاح لهذا الكتاب.</p>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// };

// export default UserReader;






// src/components/Books/pages/BookReader.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import axios from "axios";
import voice from "../components/assetes/volume.png"
// import sum from "../components/assetes/sum.png"
// import summery from "../components/assetes/"
// import summery from "../../assets/summery.png";
import "../styles.css";

const API_BASE_URL = "http://app.elfar5a.com";
const USER_TOKEN = localStorage.getItem("authToken");

// --- تم إعادة تصميم الـ CSS بالكامل لحل مشكلة التنسيق ---


const UserReader = () => {
  const { bookId } = useParams();
  const location = useLocation();

  const [bookData, setBookData] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [tooltip, setTooltip] = useState({
  //   visible: false, x: 0, y: 0, selectedText: ""
  // });
  const [tooltip, setTooltip] = useState({
  visible: false,
  x: 0,
  y: 0,
  selectedText: "",
  translation: "",
});
  const [selectedLang, setSelectedLang] = useState("ar"); // الافتراضي
  const [selectedTTSLang, setSelectedTTSLang] = useState("en"); // للصوت


  const contentRef = useRef(null);
  const initialBookTitle = location.state?.bookTitle || "Book Title";

  const handlePreviewBook = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  setContent("");

  try {
    // 1️⃣ نجيب كل كتب المستخدم
    const res = await axios.get(
      `${API_BASE_URL}/api/document/documents`,
      {
        headers: USER_TOKEN ? { Authorization: `Bearer ${USER_TOKEN}` } : {}
      }
    );

    const documents = res.data?.data || [];

    // 2️⃣ ندوّر على الكتاب المطلوب بالـ ID اللي جاي من الـ URL
    const foundBook = documents.find(doc => String(doc.id) === String(bookId));

    if (!foundBook) {
      throw new Error("الكتاب غير موجود في مكتبتك.");
    }

    setBookData(foundBook);

    const fileUrl = foundBook?.file_url;
    if (!fileUrl) throw new Error("لم يتم العثور على رابط الملف.");

    const fileRes = await axios.get(fileUrl, {
      headers: { Accept: "text/html" }
    });

    setContent(fileRes.data);

  } catch (err) {
    console.error("Error fetching book:", err);
    setError("حدث خطأ أثناء تحميل الكتاب: " + (err.response?.data?.message || err.message));
  } finally {
    setIsLoading(false);
  }
}, [bookId]);


  // const handlePreviewBook = useCallback(async () => {
  //   setIsLoading(true);
  //   setError(null);
  //   setContent("");
  //   try {
  //     const res = await axios.post(
  //       // `${API_BASE_URL}/api/document/preview-gutendexBook`,
  //       `${API_BASE_URL}/api/document/preview-gutendexBook`,
  //       { book_id: bookId },
  //       { headers: USER_TOKEN ? { Authorization: `Bearer ${USER_TOKEN}` } : {} }
  //     );
  //     const data = res.data?.data;
  //     const fileUrl = data?.file_url;
  //     setBookData(data);
  //     if (!fileUrl) throw new Error("لم يتم العثور على رابط ملف المحتوى.");
  //     const fileRes = await axios.get(fileUrl, { headers: { Accept: "text/html" } });
  //     setContent(fileRes.data);
  //   } catch (err) {
  //     console.error("Error fetching book:", err);
  //     setError("حدث خطأ أثناء تحميل الكتاب: " + (err.response?.data?.message || err.message));
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [bookId]);

  useEffect(() => {
    if (bookId) {
      handlePreviewBook();
    }
  }, [bookId, handlePreviewBook]);

  // const handleTextSelection = () => {
  //   const selection = window.getSelection();
  //   const selectedText = selection.toString().trim();
  //   if (selectedText.length > 0 && contentRef.current) {
  //     const range = selection.getRangeAt(0);
  //     const rect = range.getBoundingClientRect();
  //     const containerRect = contentRef.current.getBoundingClientRect();
  //     const x = rect.left - containerRect.left + rect.width / 2;
  //     const y = rect.top - containerRect.top + contentRef.current.scrollTop - 40;
  //     setTooltip({ visible: true, x, y, selectedText });
  //   } else {
  //     setTooltip((prev) => ({ ...prev, visible: false }));
  //   }
  // };

const handleTextSelection = async () => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (selectedText.length > 0 && contentRef.current) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = contentRef.current.getBoundingClientRect();
    const x = rect.left - containerRect.left + rect.width / 2;
    const y = rect.top - containerRect.top + contentRef.current.scrollTop - 40;

    
    const formData = new FormData();
    formData.append("text", selectedText);
    formData.append("target", selectedLang); // لغة الترجمة

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/translate/translate`,
        formData,
        {
          headers: {
            ...(USER_TOKEN && { Authorization: `Bearer ${USER_TOKEN}` }),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const translatedWord = res.data.translation || "لم يتم العثور على ترجمة";

      setTooltip({
        visible: true,
        x,
        y,
        selectedText,
        translation: translatedWord,
      });
    } catch (err) {
      console.error("Translation API error:", err);
      setTooltip({
        visible: true,
        x,
        y,
        selectedText,
        translation: "فشل الترجمة",
      });
    }
  } else {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }
};




  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltip.visible && !event.target.closest("#reader-tooltip")) {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tooltip.visible]);

  // const handleSaveWord = () => {
  //   alert(`Word saved: "${tooltip.selectedText}"`);
  //   setTooltip((prev) => ({ ...prev, visible: false }));
  // };

  const handleAddMyProfile = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/document/import-gutendexbook`,
        {
          book_id: bookId,
          title: bookData?.title || initialBookTitle,
          format: "text/html",
        },
        { headers: { Authorization: `Bearer ${USER_TOKEN}` } }
      );
      alert("Book added to your profile successfully!");
    } catch (err) {
      alert("Failed to add book to profile: " + (err.response?.data?.message || err.message));
    }
  };

    const handleTTS = async () => {
  const formData = new FormData();
  formData.append("text", tooltip.selectedText); // أو أي نص عايزه
  formData.append("lang", selectedTTSLang); // حدد اللغة
  // formData.append("document_id", bookId); // أو أي ID مناسب

  try {
    const res = await axios.post(`${API_BASE_URL}/api/tspeech/tts`, formData, {
      headers: {
        ...(USER_TOKEN && { Authorization: `Bearer ${USER_TOKEN}` }),
        "Content-Type": "multipart/form-data",
      },
    });

    // API يفترض يرجع رابط ملف الصوت
    const audioUrl = res.data?.audio_url;
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    } else {
      alert("لم يتم توليد رابط صوتي");
    }
  } catch (err) {
    console.error("TTS API error:", err);
    alert("فشل توليد الترجمة الصوتية");
  }
};

  return (
    <>
      {/* <style>{styles}</style> */}
      <div className="reader-page-container">
        <nav className="reader-breadcrumbs">
          <Link to="/">Home</Link> <span>/</span>
          <Link to="/books">Books</Link> <span>/</span> {bookData?.title || initialBookTitle}
        </nav>

        <main className="reader-main-content" >
          {/* القسم العلوي الجديد */}
          {!isLoading && bookData && (
            <header className="reader-header">
              <div className="reader-header-cover">
                {/* <img src={bookData.formats?.['image/jpeg']} alt={`Cover of ${bookData.title}`} /> */}
              </div>
              <div className="reader-header-info">
                <h2>{bookData.title}</h2>
                {bookData.authors?.length > 0 && (
                  <p className="author-name">by {bookData.authors.map(a => a.name).join(', ')}</p>
                )}
                <div className="reader-header-buttons">
                  {/* <button className="action-button-primary" onClick={handleAddMyProfile}> */}
                    {/* Add to My Profile */}
                  {/* </button> */}
                  {bookData.file_url && (
                    <a href={bookData.file_url} download className="action-button-secondary"style={{marginTop: "20px"}}>
                      Download
                    </a>
                  )}
                </div>
              </div>
                         {/* اختيار اللغة */}
            <div style={{ margin: "16px 0" }}>
              <label htmlFor="lang-select" >  Choose Translation Language: </label>
              <select
                id="lang-select"
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
              >
                <option value="ar">Arabic</option>
                <option value="en">English</option>
                <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="es">Spanish</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                    <option value="ru">Russian</option>
                    <option value="zh">Chinese</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="hi">Hindi</option>
                    <option value="tr">Turkish</option>
                    <option value="nl">Dutch</option>
                    <option value="sv">Swedish</option>
                    <option value="pl">Polish</option>
                    <option value="el">Greek</option>
                    <option value="id">Indonesian</option>
                    <option value="th">Thai</option>
                    <option value="vi">Vietnamese</option>
                    <option value="he">Hebrew</option>
                    <option value="fa">Persian (Farsi)</option>
                    <option value="ur">Urdu</option>
                    <option value="bn">Bengali</option>
                {/* أضف لغات أخرى لو حابب */}
              </select>
            </div>
            <div style={{ margin: "16px 0" }}>
            <label htmlFor="tts-lang-select">Select Voice Language: </label>
            <select
              id="tts-lang-select"
              value={selectedTTSLang}
              onChange={(e) => setSelectedTTSLang(e.target.value)}
            >
              <option value="ar">Arabic</option>
              <option value="en">English</option>
              <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="es">Spanish</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                  <option value="ru">Russian</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="hi">Hindi</option>
                  <option value="tr">Turkish</option>
                  <option value="nl">Dutch</option>
                  <option value="sv">Swedish</option>
                  <option value="pl">Polish</option>
                  <option value="el">Greek</option>
                  <option value="id">Indonesian</option>
                  <option value="th">Thai</option>
                  <option value="vi">Vietnamese</option>
                  <option value="he">Hebrew</option>
                  <option value="fa">Persian (Farsi)</option>
                  <option value="ur">Urdu</option>
                  <option value="bn">Bengali</option>
                                {/* أضف لغات لو عايز */}
            </select>
            </div>

            </header>
          )}

          {/* قسم محتوى القراءة */}
          <section
            ref={contentRef}
            className="reader-content-column"
            onMouseUp={handleTextSelection}
          >
            {/* {tooltip.visible && (
              <div id="reader-tooltip" style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px`, transform: "translateX(-50%)" }}>
                <button onClick={handleSaveWord} title="Save this word">⭐</button>
                <span>{tooltip.selectedText}</span>
              </div>
            )} */}

{tooltip.visible && (
  <div
    id="reader-tooltip"
    // style={{
    //   left: `${tooltip.x}px`,
    //   top: `${tooltip.y}px`,
    //   transform: "translateX(-50%)",
    //   background: "#f0f8ff",
    //   color: "#333",
    //   borderRadius: "8px",
    //   padding: "16px",
    //   width: "250px",
    //   boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    // }}
        style={{
      // position: "absolute",
      // left: `${tooltip.x}px`,
      // top: `${tooltip.y}px`,
      // // transform: "translateX(-50%)",
      // transform: "translate(-50%, -50%)",
      // background: "#fff",
      // border: "1px solid #ddd",
      // borderRadius: "8px",
      // padding: "12px",
      // boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      // zIndex: 10,
        position: "absolute",
        left: `${tooltip.x}px`,
        top: `${tooltip.y}px`,
        transform: "translate(-50%, -50%)",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        zIndex: 10,
    }}
  >
    {/* <h4 style={{ margin: "0 0 8px 0" }}>{tooltip.selectedText}</h4> */}
    <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#777" }}>
      {tooltip.translation}
    </p>

    <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
      {/* <button onClick={() => {
        const utterance = new SpeechSynthesisUtterance(tooltip.selectedText);
        speechSynthesis.speak(utterance);
      }}>
      <img src={voice} alt="Save" style={{ width: "20px", height: "20px" }} />
      </button> */}

      <button onClick={handleTTS}>
        <img src={voice} alt="Play TTS" style={{ width: "20px", height: "20px" }} />
      </button>

      <button onClick={() => alert(`Saved: ${tooltip.selectedText}`)}>
      {/* <img src={sum} alt="Save" style={{ width: "20px", height: "20px" }} /> */}
        </button>

      {/* <button>📝</button> */}
    </div>
  </div>
)}


            {isLoading && <p className="loading-message">جاري تحميل الكتاب...</p>}
            {error && <p className="loading-message" style={{ color: 'red' }}>{error}</p>}
            {!isLoading && !error && content && (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            )}
            {!isLoading && !error && !content && (
              <p className="loading-message">لم يتم العثور على محتوى لهذا الكتاب.</p>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default UserReader;

