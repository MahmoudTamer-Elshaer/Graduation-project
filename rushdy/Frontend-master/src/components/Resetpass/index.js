import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Sign Up/index.css";
import Sign from "../../assets/images/signup.png";
import Logo from "../../assets/logo/Frame 1984078263.svg";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // جلب الـ email والـ resetToken من الـ OTP page
  const email = location.state?.email;
  const resetToken = location.state?.resetToken;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!email) {
      setMessage("Email is missing. Please go back to the OTP page.");
      setLoading(false);
      return;
    }

    if (!resetToken) {
      setMessage("Reset token is missing. Please go back to the OTP page.");
      setLoading(false);
      return;
    }

    if (!formData.newPassword) {
      setMessage("New Password is required.");
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage("The new password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setMessage("The new password confirmation does not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://app.elfar5a.com/api/auth/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email: email,
          reset_token: resetToken,
          password: formData.newPassword,
          password_confirmation: formData.confirmNewPassword,
        }),
      });

      const data = await response.json();
      console.log("Reset Password Response:", data, "Status:", response.status);

      if (response.ok) {
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setMessage(data.message || "Failed to reset password. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again later: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container">
        <div className="left-side">
          <img src={Sign} alt="Reset Password Illustration" />
          <div className="logo">
            <img src={Logo} alt="Lixeread Logo" />
          </div>
        </div>

        <div className="right-side">
          <h2>Reset Your Password</h2>
          <p className="subheading">Enter your new password</p>

          {message && <p className="message">{message}</p>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="newPassword">New Password</label>
            <div className="password-field">
              <input
                type="password"
                id="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>

            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            <div className="password-field">
              <input
                type="password"
                id="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Resetting..." : "Confirm Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;