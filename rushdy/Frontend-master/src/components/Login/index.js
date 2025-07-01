import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./index.css";
import Logo from "../../assets/images/logo.png";
import login from "../../assets/images/login.png";
import Eye from "../../assets/icons/eye.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Load saved credentials if "Remember Me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "remember") setRememberMe(e.target.checked);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://app.elfar5a.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user data
        localStorage.setItem("authToken", data.data.token);
        localStorage.setItem("userName", data.data.name); // حفظ الـ name كـ userName
        localStorage.setItem("userEmail", data.data.email);

        // Handle "Remember Me"
        if (rememberMe) {
          localStorage.setItem("savedEmail", email);
          localStorage.setItem("savedPassword", password);
        } else {
          localStorage.removeItem("savedEmail");
          localStorage.removeItem("savedPassword");
        }

        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      } else {
        setMessage(data.message || "Failed to login. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="container">
        <div className="left-section">
          <div className="top-logo">
            <img src={Logo} alt="" />
          </div>
          <div className="main-image">
            <img src={login} alt="" />
          </div>
        </div>

        <div className="right-section">
          <h2>Welcome Back!</h2>
          <p>Log in to get started</p>

          {message && (
            <p
              className={`message ${
                message.includes("successful") ? "success" : "error"
              }`}
            >
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="yourmail@example.com"
                value={email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handleChange}
                  required
                />
                <span className="eye-icon" onClick={togglePasswordVisibility}>
                  <img src={Eye} alt="" />
                </span>
              </div>
            </div>

            <div className="options">
              <div className="rememberme">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="remember">Remember Me</label>
              </div>
              <Link to="/forget-password" className="forget-link">
                Forget Password
              </Link>
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="social-buttons">
            <button className="social-btn google-btn">
              Sign up with Google
            </button>
            <button className="social-btn facebook-btn">
              Sign up with Facebook
            </button>
          </div>

          <p className="signup-text">
            Don't have an account? <Link to="/signup">Sign up now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
