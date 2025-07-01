import React, { useState, useEffect } from "react";
import "./style.css";
import Logo from "../../assets/logo.png";
import Account from "../../assets/account.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "Abdo Zaki");
  const [avatarUrl, setAvatarUrl] = useState(localStorage.getItem("avatarUrl") || "");

  // تحديث الـ state كل ما يتغير الـ localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setUserName(localStorage.getItem("userName") || "Abdo Zaki");
      setAvatarUrl(localStorage.getItem("avatarUrl") || "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={Logo} alt="Logo" />
        <span>LexiRead</span>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/translate">Translate</Link></li>
        <li><Link to="/wordlist">Word List</Link></li>
        <li><Link to="/community">Community</Link></li>
        <li><Link to="/lexibot">Lexi Bot</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/memorized">Memorized</Link></li>
        <li><Link to="/mcq">MCQ</Link></li>
      </ul>
      <div className="nav-profile">
        <Link to="/profile" className="profile-content">
          <img src={avatarUrl || Account} alt="Profile" style={{ width: "30px", height: "30px", borderRadius: "50%" }} />
          <span>{userName}</span>
        </Link>
        <i className="fas fa-chevron-down"></i>
      </div>
    </nav>
  );
};

export default Navbar;