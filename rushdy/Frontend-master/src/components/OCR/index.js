import React, { useState, useEffect } from "react";
import "../OCR/index.css";
import "../OCR/guide.css";
import "../OCR/global.css";
import logo from "../../assets/images/logo.png";
import face from "../../assets/icons/facebook.png";
import gmail from "../../assets/icons/gmail.png";
import instgram from "../../assets/icons/instgram.png";
import text from "../../assets/icons/text.png";
import image from "../../assets/icons/image.png";
import Switch from "../../assets/icons/switch.png";
import voice from "../../assets/icons/voice.png";
import Upload from "../../assets/icons/upload.png";
import img from "../../assets/images/image.png";

const OCR = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [translatedTextForImage2, setTranslatedTextForImage2] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayLang, setDisplayLang] = useState({
    source: localStorage.getItem("sourceLangCode") || "en",
    target: localStorage.getItem("targetLangCode") || "ar",
  });

  useEffect(() => {
    // تحديث localStorage لما اللغة تتغير
    localStorage.setItem("sourceLangCode", displayLang.source);
    localStorage.setItem("targetLangCode", displayLang.target);

    // استماع لرسائل من الصفحات الفرعية (lang و lang-ar)
    const handleMessage = (event) => {
      console.log("Received message in OCR:", event.data);

      if (event.data && event.data.lang) {
        const langCode = getLangCode(event.data.lang.toLowerCase());
        console.log("Language selected:", langCode);

        setDisplayLang((prev) => {
          const updatedLang = { ...prev };
          if (event.data.from === "source") {
            updatedLang.source = langCode;
            localStorage.setItem("sourceLang", event.data.lang); // تخزين الاسم الكامل
            console.log("Updated source to:", langCode);
          } else if (event.data.from === "target") {
            updatedLang.target = langCode;
            localStorage.setItem("targetLang", event.data.lang); // تخزين الاسم الكامل
            console.log("Updated target to:", langCode);
          }
          console.log("New displayLang:", JSON.stringify(updatedLang));
          return updatedLang;
        });
      } else {
        console.log("No lang data in event:", event.data);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [displayLang]);

  const getLangCode = (lang) => {
    const langMap = {
      "english": "en",
      "mandarin chinese": "zh",
      "hindi": "hi",
      "spanish": "es",
      "french": "fr",
      "arabic": "ar",
      "bengali": "bn",
      "russian": "ru",
      "portuguese": "pt",
      "urdu": "ur",
      "indonesian": "id",
      "german": "de",
      "japanese": "ja",
      "swahili": "sw",
      "marathi": "mr",
    };
    return langMap[lang] || "en";
  };

  const getFullLangName = (code) => {
    const langMap = {
      "en": "English",
      "zh": "Mandarin Chinese",
      "hi": "Hindi",
      "es": "Spanish",
      "fr": "French",
      "ar": "Arabic",
      "bn": "Bengali",
      "ru": "Russian",
      "pt": "Portuguese",
      "ur": "Urdu",
      "id": "Indonesian",
      "de": "German",
      "ja": "Japanese",
      "sw": "Swahili",
      "mr": "Marathi",
    };
    return langMap[code] || "English";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (validImageTypes.includes(file.type)) {
        setSelectedImage(file);
        setMessage("");
      } else {
        setSelectedImage(null);
        setMessage("Please select a valid image file (e.g., .jpg or .png).");
      }
    } else {
      setMessage("Please select an image.");
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      setMessage("Please select an image to upload.");
      return;
    }

    setLoading(true);
    setMessage("Uploading and translating...");

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("target", displayLang.target); // استخدام displayLang.target بدل targetLang

    for (let pair of formData.entries()) {
      console.log("FormData entry:", pair[0], pair[1]);
    }

    try {
      const response = await fetch("http://app.elfar5a.com/api/ocr/translate", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
          "User-Agent": "PostmanRuntime/7.40.0",
          "Authorization": "Bearer 15|gguIRBdj21n3ZfVBj0AN0P2iZ6bgWtlaB0nMtQ534cf8624e",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Raw server response:", errorText);
        console.error("Sent headers:", response.headers);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("OCR translation response:", data, "Status:", response.status);

      if (data && data.translated_text) {
        const translated = data.translated_text || "No translation provided.";
        setTranslatedTextForImage2(translated);
        setMessage("Translated successfully!");
      } else {
        setMessage("No translation data received from the server.");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.message.includes("HTTP error! status: 401")) {
        setMessage("Unauthorized (401). Please ensure authentication is provided.");
      } else if (error.message.includes("HTTP error! status: 422")) {
        setMessage("Unprocessable content (422). Please check the sent data.");
      } else if (error.message.includes("HTTP error! status: 500")) {
        setMessage("Server error (500). Please try again later or contact support.");
      } else {
        setMessage("An error occurred. Please try again: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const openTranslatePage = () => {
    window.location.href = "/translate";
  };

  const openSourceLangPage = () => {
    window.open(`/lang?from=source`, "_blank");
  };

  const openTargetLangPage = () => {
    window.open(`/lang-ar?from=target`, "_blank");
  };

  // دالة لقياس أبعاد الصورة المرفوعة
  const getImageDimensions = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.src = URL.createObjectURL(file);
    });
  };

  return (
    <div className="ocr">
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
            <div
              className="frame-16"
              style={{ cursor: "pointer" }}
              onClick={openTranslatePage}
            >
              <img className="img-2" src={text} alt="Text Icon" />
              <div className="text-wrapper-7">Text</div>
            </div>
            <div className="frame-17">
              <img className="img-2" src={image} alt="Image Icon" />
              <div className="text-wrapper-7">images</div>
            </div>
          </div>
          <div className="frame-18">
            <div className="frame-19">
              <div className="frame-20">
                <div className="frame-21">
                  <div className="frame-22"></div>
                </div>
              </div>
            </div>
            <div className="frame-23">
              <button
                className="frame-24"
                onClick={openSourceLangPage}
                style={{ cursor: "pointer", background: "var(--primaryprimary-50)", borderRadius: "10px", border: "none", padding: "16px" }}
              >
                <div className="text-wrapper-8">{getFullLangName(displayLang.source)}</div>
              </button>
              <img className="frame-25" src={Switch} alt="Switch Icon" />
              <button
                className="frame-24"
                onClick={openTargetLangPage}
                style={{ cursor: "pointer", background: "var(--primaryprimary-50)", borderRadius: "10px", border: "none", padding: "16px" }}
              >
                <div className="text-wrapper-8">{getFullLangName(displayLang.target)}</div>
              </button>
            </div>
          </div>
        </div>
        <div className="frame-26">
          <div className="text-wrapper-9">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  const { width, height } = await getImageDimensions(file);
                  const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
                  if (validImageTypes.includes(file.type)) {
                    setSelectedImage(file);
                    setMessage("");
                  } else {
                    setSelectedImage(null);
                    setMessage("Please select a valid image file (e.g., .jpg or .png).");
                  }
                } else {
                  setMessage("Please select an image.");
                }
              }}
              style={{ display: "none" }}
              id="image-upload"
            />
            <label htmlFor="image-upload" style={{ cursor: "pointer" }}>
              Click to Upload
            </label>
          </div>
          <img
            className="cloud-upload-alt"
            src={Upload}
            onClick={handleUpload}
            style={{ cursor: "pointer" }}
            alt="Upload Icon"
          />
        </div>
        {selectedImage ? (
          <div
            style={{
              position: "absolute",
              top: "413px",
              left: "281px",
              width: "388px",
              height: "547px",
              overflowX: "auto",
              overflowY: "auto",
            }}
          >
            <img
              className="image"
              src={URL.createObjectURL(selectedImage)}
              alt="Selected Image"
            />
          </div>
        ) : (
          <img
            className="image"
            src={img}
            alt="Default Image"
            style={{
              position: "absolute",
              top: "413px",
              left: "281px",
              width: "388px",
              height: "547px",
              objectFit: "cover",
            }}
          />
        )}
        {translatedTextForImage2 ? (
          <div
            style={{
              position: "absolute",
              top: "413px",
              left: "741px",
              width: "388px",
              height: "547px",
              overflowX: "auto",
              overflowY: "auto",
            }}
          >
            <p className="image-2">{translatedTextForImage2}</p>
          </div>
        ) : (
          <img
            className="image-2"
            src={img}
            alt="Translated Image Placeholder"
            style={{
              position: "absolute",
              top: "413px",
              left: "741px",
              width: "388px",
              height: "547px",
              objectFit: "cover",
            }}
          />
        )}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default OCR;