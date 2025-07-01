import React, { useEffect } from "react";
import "../Lang-ar/index.css";
import Switch from "../../assets/icons/switch.png";

const La = () => {
  useEffect(() => {
    const handleLanguageSelect = (lang) => {
      window.opener.postMessage({ lang: lang, from: "target" }, "*");
      window.close();
    };

    const languageElements = document.querySelectorAll(".text-wrapper-8");
    languageElements.forEach((element) => {
      element.addEventListener("click", () => {
        handleLanguageSelect(element.textContent.toLowerCase());
      });
    });

    return () => {
      languageElements.forEach((element) => {
        element.removeEventListener("click", () => {});
      });
    };
  }, []);

  return (
    <div>
      <div className="lang-ar">
        <div className="div">
          <div className="frame-14">
            <div className="frame-18">
              <div className="frame-26">
                <div className="frame-27">
                  <div className="text-wrapper-9">English</div>
                </div>
                <img className="frame-28" src={Switch} alt="Switch Languages" />
                <div className="frame-27">
                  <div className="text-wrapper-9">Arabic</div>
                </div>
              </div>
              <div className="frame-19">
                <div className="frame-20">
                  <div className="frame-21">
                    <div className="frame-22"></div>
                    <div className="frame-23">
                      <div className="frame-24">
                        <div className="frame-25">
                          <div className="text-wrapper-8">Arabic</div>
                        </div>
                      </div>
                      <div className="frame-24">
                        <div className="frame-25">
                          <div className="text-wrapper-8">Mandarin Chinese</div>
                        </div>
                      </div>
                      <div className="frame-24">
                        <div className="frame-25">
                          <div className="text-wrapper-8">Spanish</div>
                        </div>
                      </div>
                      <div className="frame-24">
                        <div className="frame-25">
                          <div className="text-wrapper-8">English</div>
                        </div>
                      </div>
                      <div className="frame-24">
                        <div className="frame-25">
                          <div className="text-wrapper-8">Hindi</div>
                        </div>
                      </div>
                      <div className="frame-24">
                        <div className="frame-25">
                          <div className="text-wrapper-8">Bengali</div>
                        </div>
                      </div>
                      <div className="frame-24">
                        <div className="frame-25">
                          <div className="text-wrapper-8">Portuguese</div>
                        </div>
                      </div>
                      <div className="frame-24">
                        <div className="frame-25">
                          <div className="text-wrapper-8">Russian</div>
                        </div>
                      </div>
                      <div className="frame-24">
                        <div className="frame-25">
                          <div className="text-wrapper-8">Japanese</div>
                        </div>
                      </div>
                      <div className="frame-24">
                        <div className="frame-25">
                          <div className="text-wrapper-8">Urdu</div>
                        </div>
                      </div>
                      <div className="frame-24">
                        <div className="frame-25">
                          <div className="text-wrapper-8">Indonesian</div>
                        </div>
                      </div>
                      <div className="frame-24">
                        <div className="frame-25">
                          <div className="text-wrapper-8">German</div>
                        </div>
                      </div>
                      <div className="frame-24">
                        <div className="frame-25">
                          <div className="text-wrapper-8">Swahili</div>
                        </div>
                      </div>
                      <div className="frame-24">
                        <div className="frame-25">
                          <div className="text-wrapper-8">Marathi</div>
                        </div>
                      </div>
                      <div className="frame-24">
                        <div className="frame-25">
                          <div className="text-wrapper-8">French</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default La;