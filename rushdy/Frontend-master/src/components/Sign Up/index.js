import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Sign Up/index.css";
import Sign from "../../assets/images/signup.png";
import Logo from "../../assets/logo/Frame 1984078263.svg";
import face from "../../assets/icons/facebook-01.svg";
import google from "../../assets/icons/google.svg";
import Eye from "../../assets/icons/eye.svg";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!formData.username) {
      setMessage("User Name is required.");
      setLoading(false);
      return;
    }
    if (!formData.email) {
      setMessage("Email Address is required.");
      setLoading(false);
      return;
    }
    if (!formData.password) {
      setMessage("Password is required.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setMessage("The password field must be at least 8 characters.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setMessage("The password field confirmation does not match.");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("password_confirmation", formData.password_confirmation);

    try {
      const response = await fetch("http://app.elfar5a.com/api/auth/register", {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
        body: formDataToSend,
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        localStorage.setItem("authToken", data.data.token);
        localStorage.setItem("userName", data.data.name);
        localStorage.setItem("userEmail", data.data.email);

        setMessage("Registration successful! Welcome, " + data.data.name);
        setFormData({
          username: "",
          email: "",
          password: "",
          password_confirmation: "",
        });
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(" ");
          setMessage(errorMessages || "Registration failed. Please try again.");
        } else {
          setMessage(data.message || "Registration failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container">
        <div className="left-side">
          <img src={Sign} alt="Signup Illustration" />
          <div className="logo">
            <img src={Logo} alt="Lixeread Logo" />
          </div>
        </div>

        <div className="right-side">
          <h2>Join Lixeread Today</h2>
          <p className="subheading">sign up for a new account</p>

          {message && <p className="message">{message}</p>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="username">User Name</label>
            <input
              type="text"
              id="username"
              placeholder=""
              value={formData.username}
              onChange={handleChange}
            />

            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder=""
              value={formData.email}
              onChange={handleChange}
            />

            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
              />
              <span className="eye-icon" onClick={togglePasswordVisibility}>
                <img src={Eye} alt="Toggle password visibility" />
              </span>
            </div>

            <label htmlFor="password_confirmation">Confirm Password</label>
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="password_confirmation"
                placeholder=""
                value={formData.password_confirmation}
                onChange={handleChange}
              />
              <span className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
                <img src={Eye} alt="Toggle password visibility" />
              </span>
            </div>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Registering..." : "Sign Up"}
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="social-buttons">
              <button className="google-btn">
                <img src={google} alt="Google Icon" className="btn-icon" />
                <span>Sign up with Google</span>
              </button>
              <button className="facebook-btn">
                <img src={face} alt="Facebook Icon" className="btn-icon" />
                <span>Sign up with Facebook</span>
              </button>
            </div>

            <p className="footer-text">
              Do you have an account? <a href="/login">Login now</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;