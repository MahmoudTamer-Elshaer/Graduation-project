import React, { useState, useEffect } from "react";
import "../Lexibot/global.css";
import "../Lexibot/guide.css";
import "../Lexibot/index.css";
import logo from "../../assets/images/logo.png";
import face from "../../assets/icons/facebook.png";
import gmail from "../../assets/icons/gmail.png";
import instgram from "../../assets/icons/instgram.png";
import send from "../../assets/icons/send-2.png";
import frame from "../../assets/icons/Frame 60.png";

const Lexibot = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [placeholder, setPlaceholder] = useState("Type your message here...");
  const [chatHistory, setChatHistory] = useState([]); // لتخزين الشاتات المحفوظة
  const [currentChatId, setCurrentChatId] = useState(null); // لتحديد الشات الحالي

  // تحميل الشاتات المحفوظة من localStorage عند تحميل المكون
  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setChatHistory(savedChats);
  }, []);

  // كشف اللغة (عربي أو إنجليزي)
  const detectLanguage = (text) => {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text) ? "rtl" : "ltr";
  };

  // تحديث النص المدخل
  const handleInputChange = (e) => {
    const text = e.target.value;
    setMessage(text);
    e.target.style.direction = detectLanguage(text);
    setPlaceholder(text.trim() === "" ? "Type your message here..." : detectLanguage(text) === "rtl" ? "اكتب رسالتك هنا..." : "Type your message here...");
  };

  // حفظ الشات في localStorage
  const saveChatToLocalStorage = (chatId, messages) => {
    const savedChats = JSON.parse(localStorage.getItem("chatHistory")) || [];
    const updatedChats = savedChats.filter((chat) => chat.id !== chatId);
    updatedChats.push({ id: chatId, messages });
    localStorage.setItem("chatHistory", JSON.stringify(updatedChats));
    setChatHistory(updatedChats);
  };

  // إرسال الرسالة
  const handleSendMessage = async () => {
    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }

    const newMessage = { type: "user", text: message.trim(), direction: detectLanguage(message.trim()) };
    const updatedMessages = [newMessage, ...messages];
    setMessages(updatedMessages);

    // حفظ الرسالة في الشات الحالي
    const chatId = currentChatId || `chat-${Date.now()}`;
    setCurrentChatId(chatId);
    saveChatToLocalStorage(chatId, updatedMessages);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://app.elfar5a.com/api/gemini/chat", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Raw server response:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", JSON.stringify(data, null, 2));

      if (data && data.data && data.data.ai_response && data.data.ai_response.message) {
        const botMessage = {
          type: "bot",
          text: data.data.ai_response.message,
          direction: detectLanguage(data.data.ai_response.message),
        };
        const finalMessages = [botMessage, ...updatedMessages];
        setMessages(finalMessages);
        saveChatToLocalStorage(chatId, finalMessages); // حفظ الشات بعد رد البوت
      } else {
        console.error("Response structure:", JSON.stringify(data, null, 2));
        setError("No valid response message found. Check console for response structure.");
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = "";
      if (error.message.includes("HTTP error! status: 401")) {
        errorMessage = "Unauthorized (401). Please ensure authentication is provided.";
      } else if (error.message.includes("HTTP error! status: 422")) {
        errorMessage = "Unprocessable content (422). Please check the sent data.";
      } else if (error.message.includes("HTTP error! status: 500")) {
        errorMessage = "Server error (500). Please try again later or contact support.";
      } else {
        errorMessage = "An error occurred. Please try again: " + error.message;
      }
      setError(errorMessage);
      setMessages((prev) => [
        { type: "error", text: errorMessage, direction: detectLanguage(errorMessage) },
        ...prev,
      ]);
    } finally {
      setLoading(false);
      setMessage("");
      setPlaceholder("Type your message here...");
    }
  };

  // تحميل الشات المحفوظ عند الضغط على "Translate name chat"
  const loadChat = (chatId) => {
    const savedChats = JSON.parse(localStorage.getItem("chatHistory")) || [];
    const selectedChat = savedChats.find((chat) => chat.id === chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
      setCurrentChatId(chatId);
    }
  };

  // إنشاء شات جديد
  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(`chat-${Date.now()}`);
    setError("");
  };

  return (
    <div className="lexi-bot">
      <div className="div">
        <div className="frame-wrapper">
          <div className="frame-8">
            <div className="frame-9">
              <div className="group">
                <img className="group" src={logo} alt="Logo" />
              </div>
              <p className="p">
                OurStudio is a digital agency UI / UX Design and Website Development located in Ohio, United States of
                America OurStudio
              </p>
            </div>
            <div className="frame-9">
              <div className="text-wrapper-4">Follow Us</div>
              <div className="frame-10">
                <div className="frame-11">
                  <img className="img-2" src={face} alt="Facebook" />
                  <p className="text-wrapper-5">8819 Ohio St. South Gate, CA</p>
                </div>
                <div className="frame-6">
                  <img className="img-2" src={gmail} alt="Gmail" />
                  <div className="text-wrapper-5">Ourstudio@hello.com</div>
                </div>
                <div className="frame-6">
                  <img className="img-2" src={instgram} alt="Instagram" />
                  <div className="text-wrapper-5">+1 386-688-3295</div>
                </div>
              </div>
            </div>
            <div className="frame-12">
              <div className="div-wrapper">
                <div className="text-wrapper-6">About us</div>
              </div>
              <div className="frame-13">
                <div className="text-wrapper-6">Terms and Conditions</div>
              </div>
              <div className="frame-13">
                <div className="text-wrapper-6">privacy policy</div>
              </div>
            </div>
          </div>
        </div>
        <div className="frame-14">
          <div className="frame-15">
            <div className="text-wrapper-7">Lexi Bot</div>
          </div>
        </div>
        <div className="chat-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.type === "user"
                  ? "hello-i-need-to-wrapper"
                  : msg.type === "bot"
                  ? "sure-the-translation-wrapper"
                  : "sure-the-translation-wrapper"
              }
            >
              <p
                className={msg.type === "user" ? "text-wrapper-11" : "text-wrapper-12"}
                style={{ direction: msg.direction }}
              >
                {msg.text}
              </p>
            </div>
          ))}
        </div>
        <div className="frame-16">
          <div className="frame-17">
            <div className="frame-18">
              <input
                type="text"
                className="text-wrapper-8"
                placeholder={placeholder}
                value={message}
                onChange={handleInputChange}
                disabled={loading}
              />
              <img
                className="img-2"
                src={send}
                alt="Send"
                onClick={handleSendMessage}
                style={{ cursor: loading ? "not-allowed" : "pointer" }}
              />
            </div>
          </div>
        </div>
        <div className="overlap-group">
          <img className="line" src="img/line-2.svg" alt="Line" />
          <div className="frame-21">
            <div className="text-wrapper-10" onClick={startNewChat}>
              New Chat
            </div>
            <img className="frame-22" src={frame} alt="Frame" />
          </div>
          <div className="text-wrapper-11">History Lexi</div>
          {chatHistory.map((chat, index) => (
            <div
              key={chat.id}
              className={`frame-${23 + index}`}
              onClick={() => loadChat(chat.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="text-wrapper-12">Chat {index + 1}</div>
              <img className="frame-22" src={frame} alt="Frame" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lexibot;