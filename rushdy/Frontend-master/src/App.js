import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/index";
import Footer from "./components/Footer/index";
import Home from "./components/Home/index";

import BookListPage from "../src/components/Books/components copy/BookList";
import BookDetailPage from "./components/Books/pages/BookDetailPage";
import UserBookDetail from "./components/Books/components copy/UserBookDetail";
import BookReader from "./components/Books/pages/BookReader";
import UserReader from "./components/Books/pages/userReader"

import Community from "./components/Community/index";
import Lexibot from "./components/Lexibot/index";
import Translate from "./components/Translate/index";
import Wordlist from "./components/Wordlist/index";
import Login from "./components/Login";
import Signup from "./components/Sign Up/index";
import Forgetpass from "./components/Forgetpass/index";
import OTP from "./components/OTP/index";
import OCR from "./components/OCR/index";
import Lang from "./components/Lang/index";
import La from "./components/Lang-ar/index";
import Profile from "./components/Profile/index";
import ResetPassword from "./components/Resetpass/index";
import Memorized from "./components/Memorized";
import MCQ from "./components/MCQ/index";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/books" element={<BookListPage />} />
          <Route path="/book/:bookId" element={<BookDetailPage />} />
          <Route path="/user/:bookId" element={<UserBookDetail />} />
          <Route path="/reader/:bookId" element={<BookReader />} />
          <Route path="/userReader/:bookId" element={<UserReader />} />

          <Route path="/translate" element={<Translate />} />
          <Route path="/wordlist" element={<Wordlist />} />
          <Route path="/community" element={<Community />} />
          <Route path="/lexibot" element={<Lexibot />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forget-password" element={<Forgetpass />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/lang" element={<Lang />} />
          <Route path="/lang-ar" element={<La />} />
          <Route path="/ocr" element={<OCR />} />
          <Route path="/memorized" element={<Memorized />} />
          <Route path="/mcq" element={<MCQ />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
