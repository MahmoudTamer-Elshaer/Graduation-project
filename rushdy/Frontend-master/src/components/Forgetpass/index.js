import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Forgetpass/index.css";
import Logo from "../../assets/logo/Frame 1984078263.svg";

const Forgetpass = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate(); // تم نقل هذا السطر لأعلى

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://app.elfar5a.com/api/auth/forgetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });
      

      const data = await response.json();
      console.log("API Response:", response.status, data);

      if (response.ok) {
        setMessage("OTP sent to your email. Please check your inbox (including Spam/Junk).");
        setEmail("");
        navigate("/otp", { state: { email } });
      } else {
        setMessage(data.message || "Failed to send OTP. Please check your email and try again.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setMessage("An error occurred. Please try again later. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setMessage("Please enter an email to resend OTP.");
      return;
    }
    setResendLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://app.elfar5a.com/api/auth/forgetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("Resend API Response:", response.status, data);

      if (response.ok) {
        setMessage("OTP resent to your email. Please check your inbox (including Spam/Junk).");
      } else {
        setMessage(data.message || "Failed to resend OTP. Please check your email and try again.");
      }
    } catch (error) {
      console.error("Resend Fetch Error:", error);
      setMessage("An error occurred while resending. Please try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="forget">
      <div className="container">
        <div className="left-section">
          <div className="top-logo">
            <img src={Logo} alt="Lixeread Logo" />
          </div>
        </div>

        <div className="right-section">
          <h2>Forget Password</h2>
          <p>We will send you an OTP code via email, please enter it to confirm the transaction.</p>

          {message && (
            <p className={`message ${message.includes("OTP sent") || message.includes("OTP resent") ? "success" : "error"}`}>
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="yourmail@example.com"
                value={email}
                onChange={handleChange}
                required
              />
            </div>

            <button className="verify-btn" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
          <p className="resend-text">
            Didn't receive the code?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); handleResend(); }} disabled={resendLoading}>
              {resendLoading ? "Resending..." : "Resend OTP"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forgetpass;