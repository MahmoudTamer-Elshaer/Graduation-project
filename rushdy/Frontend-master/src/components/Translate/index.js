import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import "./global.css";
import "./guide.css";
import logo from "../../assets/images/logo.png";
import face from "../../assets/icons/facebook.png";
import gmail from "../../assets/icons/gmail.png";
import instgram from "../../assets/icons/instgram.png";
import text from "../../assets/icons/text.png";
import image from "../../assets/icons/image.png";
import Switch from "../../assets/icons/switch.png";
import voice from "../../assets/icons/voice.png";
import copy from "../../assets/icons/copy.png";

const Translate = () => {
  const [inputText, setInputText] = useState("");
  const [translation, setTranslation] = useState("");
  const [moreTranslations, setMoreTranslations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [displayLang, setDisplayLang] = useState({ source: "en", target: "ar" });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No token found. Please login first.");
    } else {
      console.log("Current Token from localStorage:", token);
    }

    const handleMessage = (event) => {
      console.log("Received message:", event.data);

      if (event.data && event.data.lang) {
        const langCode = getLangCode(event.data.lang.toLowerCase());
        console.log("Language selected:", langCode);

        setDisplayLang((prev) => {
          const updatedLang = { ...prev };
          if (event.data.from === "source") {
            updatedLang.source = langCode;
            console.log("Updated source to:", langCode);
          } else if (event.data.from === "target") {
            updatedLang.target = langCode;
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
    return () => window.removeEventListener("message", handleMessage);
  }, []);

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
      "marathi": "mr"
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
      "mr": "Marathi"
    };
    return langMap[code] || "English";
  };

  const toggleLanguage = () => {
    setDisplayLang((prev) => {
      const tempSource = prev.source;
      return {
        source: prev.target,
        target: tempSource,
      };
    });
    setInputText("");
    setTranslation("");
    setMoreTranslations([]);
  };

  const handleTranslate = async () => {
    if (!inputText) {
      setError("Please enter text to translate.");
      return;
    }

    setLoading(true);
    setError("");
    setTranslation("");
    setMoreTranslations([]);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No token available. Please login first.");
        return;
      }

      console.log("Translating with target:", displayLang.target);
      const response = await axios.post(
        "http://app.elfar5a.com/api/translate/translate",
        {
          text: inputText,
          target: displayLang.target,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log("Full API Response:", JSON.stringify(data, null, 2));

      if (response.status === 200 && data.translation) {
        setTranslation(data.translation || "");
        setMoreTranslations([]);
      } else {
        setError(data.message || "Failed to translate text.");
      }
    } catch (error) {
      console.error("Error Details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setError("An error occurred while translating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTTS = async () => {
    if (!translation) {
      setError("No translation available to convert to speech.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No token available. Please login first.");
        return;
      }

      const response = await axios.post(
        "http://app.elfar5a.com/api/tspeech/tts",
        {
          text: translation,
          lang: displayLang.target,
        }, // حذفت document_id
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log("TTS API Response:", JSON.stringify(data, null, 2));

      if (response.status === 200 && data.audio_url) {
        const audio = new Audio(data.audio_url);
        audio.play().catch((err) => {
          console.error("Audio play failed:", err);
          setError("Failed to play audio. Check browser permissions.");
        });
      } else {
        setError(data.message || "Failed to generate speech.");
      }
    } catch (error) {
      console.error("TTS Error Details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setError("An error occurred while generating speech. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openSourceLanguagePage = () => {
    window.open(`/lang?from=source`, "_blank");
  };

  const openTargetLanguagePage = () => {
    window.open(`/lang-ar?from=target`, "_blank");
  };

  const openOCRPage = () => {
    window.location.href = "/ocr";
  };

  const openTranslatePage = () => {
    window.location.href = "/translate";
  };

  return (
    <div className="trans">
      <div className="translate">
        <div className="div">
          <div className="frame-wrapper">
            <div className="frame-6">
              <div className="frame-7">
                <div className="group">
                  <img className="group" src={logo} alt="OurStudio Logo" />
                  <div className="lexi-read"></div>
                </div>
                <p className="p">
                  OurStudio is a digital agency UI / UX Design and Website Development located in Ohio, United States of
                  America OurStudio
                </p>
              </div>
              <div className="frame-7">
                <div className="text-wrapper-3">Follow Us</div>
                <div className="frame-8">
                  <div className="frame-9">
                    <img className="img-2" src={face} alt="Facebook" />
                    <p className="text-wrapper-4">8819 Ohio St. South Gate, CA</p>
                  </div>
                  <div className="frame-10">
                    <img className="img-2" src={gmail} alt="Gmail" />
                    <div className="text-wrapper-4">Ourstudio@hello.com</div>
                  </div>
                  <div className="frame-10">
                    <img className="img-2" src={instgram} alt="Instagram" />
                    <div className="text-wrapper-4">+1 386-688-3295</div>
                  </div>
                </div>
              </div>
              <div className="frame-11">
                <div className="div-wrapper">
                  <div className="text-wrapper-5">About us</div>
                </div>
                <div className="frame-12">
                  <div className="text-wrapper-5">Terms and Conditions</div>
                </div>
                <div className="frame-12">
                  <div className="text-wrapper-5">privacy policy</div>
                </div>
              </div>
            </div>
          </div>
          <div className="frame-13">
            <div className="frame-14">
              <div className="frame-15" onClick={openTranslatePage}>
                <img className="img-2" src={text} alt="Text Option" />
                <div className="text-wrapper-6">Text</div>
              </div>
              <div className="frame-16" onClick={openOCRPage}>
                <img className="img-2" src={image} alt="Images Option" />
                <div className="text-wrapper-6">images</div>
              </div>
            </div>
            <div className="frame-17">
              <div className="frame-18">
                <button
                  className="frame-19"
                  onClick={openSourceLanguagePage}
                  style={{ background: "var(--primaryprimary-50)", borderRadius: "10px", border: "none", padding: "16px" }}
                >
                  <div className="text-wrapper-7">{getFullLangName(displayLang.source)}</div>
                </button>
                <img
                  className="img"
                  src={Switch}
                  alt="Switch Languages"
                  onClick={toggleLanguage}
                  style={{ cursor: "pointer" }}
                />
                <button
                  className="frame-19"
                  onClick={openTargetLanguagePage}
                  style={{ background: "var(--primaryprimary-50)", borderRadius: "10px", border: "none", padding: "16px" }}
                >
                  <div className="text-wrapper-7">{getFullLangName(displayLang.target)}</div>
                </button>
              </div>
              <div className="frame-20">
                <div className="frame-21">
                  <div className="frame-22">
                    <div
                      className="text-wrapper-8"
                      contentEditable="true"
                      onInput={(e) => setInputText(e.currentTarget.textContent)}
                      placeholder={inputText ? "" : "Enter text..."}
                      dir={displayLang.source === "ar" ? "rtl" : "ltr"}
                    >
                    </div>
                  </div>
                  <div className="frame-23">
                    <div
                      className="frame-24"
                      onClick={handleTranslate}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="text-wrapper-9">
                        {loading ? "Translating..." : "Translate"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="frame-25">
                  <div className="frame-26">
                    <div className="frame-22">
                      <div
                        className="text-wrapper-10"
                        dir={displayLang.target === "ar" ? "rtl" : "ltr"}
                      >
                        {translation || (displayLang.target === "ar" ? "الترجمة" : "Translation")}
                      </div>
                    </div>
                    <div className="frame-27">
                      {translation && (
                        <img
                          className="img-2"
                          src={voice}
                          alt="Play Translation Audio"
                          onClick={handleTTS}
                          style={{ cursor: "pointer" }}
                          onError={() => console.error("Failed to load voice icon")}
                        />
                      )}
                      <div className="copy-wrapper">
                        <img
                          className="img-2"
                          src={copy}
                          alt="Copy Translation"
                          onError={() => console.error("Failed to load copy icon")}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="frame-28">
                    <div className="frame-29">
                      <div className="text-wrapper-11">More Translations</div>
                    </div>
                    <div className="frame-30">
                      {moreTranslations.length > 0 ? (
                        moreTranslations.map((item, index) => (
                          <div className="frame-31" key={index}>
                            <div className="frame-32">
                              <div className="frame-33">
                                <div className="text-wrapper-12">{item.text}</div>
                                <div className="frame-23">
                                  <div className="text-wrapper-13">{item.type}</div>
                                  <div className="text-wrapper-14">{item.synonyms}</div>
                                </div>
                              </div>
                            </div>
                            {index < moreTranslations.length - 1 && (
                              <div className="frame-34"></div>
                            )}
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="frame-31">
                            <div className="frame-32">
                              <div className="frame-33">
                                <div className="text-wrapper-12">استفتاء</div>
                                <div className="frame-23">
                                  <div className="text-wrapper-13">Noun</div>
                                  <div className="text-wrapper-14">questionnaires</div>
                                </div>
                              </div>
                            </div>
                            <div className="frame-34"></div>
                          </div>
                          <div className="frame-31">
                            <div className="frame-32">
                              <div className="frame-33">
                                <div className="text-wrapper-12">استطلاع</div>
                                <div className="frame-23">
                                  <div className="text-wrapper-13">Noun</div>
                                  <div className="text-wrapper-14">
                                    questionnaires, questionnaires, sc...
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="frame-34"></div>
                          </div>
                          <div className="frame-31">
                            <div className="frame-32">
                              <div className="frame-33">
                                <div className="text-wrapper-12">نموذج الإستطلاع</div>
                                <div className="frame-23">
                                  <div className="text-wrapper-7">Noun</div>
                                  <div className="text-wrapper-14">questionnaire</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {error && (
                <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translate;