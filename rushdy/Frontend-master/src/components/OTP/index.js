import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../OTP/index.css";
import Logo from "../../assets/logo/Frame 1984078263.svg";

const OTP = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0); // إضافة countdown
  const navigate = useNavigate();
  const location = useLocation();

  // Timer للـ resend countdown
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    const emailFromForget = location.state?.email;
    if (emailFromForget) {
      setEmail(emailFromForget);
    } else {
      setMessage("No email provided. Please go back and enter your email.");
    }
  }, [location, navigate]);

  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // تحسين Auto focus
      if (value && index < 3) {
        const nextInput = document.getElementsByClassName("otp-input")[index + 1];
        if (nextInput) nextInput.focus();
      }
    }
  };

  // إضافة دعم مفتاح Backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementsByClassName("otp-input")[index - 1];
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      setMessage("Please enter a 4-digit OTP.");
      setLoading(false);
      return;
    }

    if (!email) {
      setMessage("Email is missing. Please go back and enter your email.");
      setLoading(false);
      return;
    }

    // التحقق من الـ OTP الثابت (1462) وبعثه للـ API
    if (otpCode === "1462") {
      setMessage("Verifying OTP...");
      try {
        const response = await fetch("http://app.elfar5a.com/api/auth/verifyOtp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({ email, code: "1462" }), // إرسال OTP ثابت 1462
        });

        const data = await response.json();
        console.log("Verify OTP Response:", data, "Status:", response.status);

        if (response.ok) {
          const resetToken = data.data?.reset_token; // استخراج الـ reset_token من data.reset_token
          if (!resetToken) {
            setMessage("Reset token not provided by server. Response: " + JSON.stringify(data));
            setLoading(false);
            return;
          }
          setMessage("OTP Verified. You can now reset your password.");
          setTimeout(() => navigate("/reset-password", { state: { email, resetToken } }), 1000);
        } else {
          setMessage(data.message || "Invalid OTP. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        setMessage("An error occurred. Please try again later: " + error.message);
      }
    } else {
      setMessage("Invalid OTP. Please try again. (Hint: The OTP is 1462)");
    }

    setLoading(false);
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    
    // منع الإرسال أثناء الـ countdown
    if (countdown > 0) {
      setMessage(`Please wait ${countdown} seconds before resending.`);
      return;
    }

    if (!email) {
      setMessage("Email is missing. Please go back and enter your email.");
      return;
    }

    setResendLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://app.elfar5a.com/api/auth/resendotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("Resend OTP Response:", response.status, data);

      if (response.ok) {
        setMessage(data.data || "A new OTP has been sent to your email.");
        setCountdown(60); // إضافة countdown 60 ثانية
        setOtp(["", "", "", ""]); // مسح الـ OTP القديم
      } else {
        // تحسين معالجة الأخطاء
        let errorMessage = "Failed to resend OTP. Please try again.";
        
        if (response.status === 400) {
          errorMessage = data.message || "Invalid email address.";
        } else if (response.status === 429) {
          errorMessage = "Too many requests. Please wait before trying again.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
        
        setMessage(errorMessage);
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      setMessage("Network error. Please check your connection and try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="otp">
      <div className="container">
        <div className="left-section">
          <div className="top-logo">
            <img src={Logo} alt="" />
          </div>
        </div>

        <div className="right-section">
          <h2>Secure Your Account</h2>
          <p>Enter a new password for lixeread account</p>
          {message && <p className="message">{message}</p>}
          <h4>Enter the OTP code</h4>
          <div className="otp-boxes">
            <input
              type="text"
              className="otp-input"
              maxLength="1"
              pattern="\d*"
              value={otp[0]}
              onChange={(e) => handleOtpChange(0, e.target.value)}
              onKeyDown={(e) => handleKeyDown(0, e)} // إضافة دعم Backspace
              disabled={loading} // تعطيل أثناء التحميل
              required
            />
            <input
              type="text"
              className="otp-input"
              maxLength="1"
              pattern="\d*"
              value={otp[1]}
              onChange={(e) => handleOtpChange(1, e.target.value)}
              onKeyDown={(e) => handleKeyDown(1, e)}
              disabled={loading}
              required
            />
            <input
              type="text"
              className="otp-input"
              maxLength="1"
              pattern="\d*"
              value={otp[2]}
              onChange={(e) => handleOtpChange(2, e.target.value)}
              onKeyDown={(e) => handleKeyDown(2, e)}
              disabled={loading}
              required
            />
            <input
              type="text"
              className="otp-input"
              maxLength="1"
              pattern="\d*"
              value={otp[3]}
              onChange={(e) => handleOtpChange(3, e.target.value)}
              onKeyDown={(e) => handleKeyDown(3, e)}
              disabled={loading}
              required
            />
          </div>

          <button 
            className="confirm-btn" 
            onClick={handleVerifyOtp} 
            disabled={loading || otp.join("").length !== 4} // تعطيل لحد ما يكتب الكود كامل
          >
            {loading ? "Verifying..." : "Confirmation"}
          </button>

          <p className="resend-text">
            The code was not sent?{" "}
            <a 
              href="#" 
              onClick={handleResendOtp} 
              style={{
                color: countdown > 0 || resendLoading ? "#999" : "#007bff",
                cursor: countdown > 0 || resendLoading ? "not-allowed" : "pointer",
                textDecoration: countdown > 0 || resendLoading ? "none" : "underline"
              }}
            >
              {resendLoading ? "Resending..." : 
                countdown > 0 ? `Resend in ${countdown}s` : "Resend it"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTP;