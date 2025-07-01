import React from "react";
import "./style.css";
import "./global.css";
import "./guide.css";
import logo from "../../assets/images/logo.png";
import face from "../../assets/icons/facebook.png";
import gmail from "../../assets/icons/gmail.png";
import instgram from "../../assets/icons/instgram.png";
import view from "../../assets/icons/viewlist.png";
import target from "../../assets/icons/target.png";

const Wordlist = () => {
  const openMemorizedPage = () => {
    window.open("/memorized", "_blank");
  };

  const openMCQPage = () => {
    window.open("/mcq", "_blank");
  };

  return (
    <div className="trans">
      <div className="word-list">
        <div className="div">
          <div className="frame-wrapper">
            <div className="frame-8">
              <div className="frame-9">
                <div className="group">
                  <img className="group" src={logo} alt="Logo" />
                </div>
                <p className="p">
                  OurStudio is a digital agency UI / UX Design and Website
                  Development located in Ohio, United States of America
                  OurStudio
                </p>
              </div>
              <div className="frame-9">
                <div className="text-wrapper-4">Follow Us</div>
                <div className="frame-10">
                  <div className="frame-11">
                    <img className="img-2" src={face} alt="Facebook" />
                    <p className="text-wrapper-5">
                      8819 Ohio St. South Gate, CA
                    </p>
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
                  <div className="text-wrapper-6">Privacy Policy</div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="frame-14"
            onClick={openMemorizedPage}
            style={{ cursor: "pointer" }}
          >
            <img className="view-list-svgrepo" src={view} alt="View List" />
            <div className="frame-15">
              <div className="text-wrapper-7">Memorized Words</div>
              <p className="text-wrapper-8">
                Words memorized from reading books
              </p>
            </div>
          </div>
          <div className="frame-16">
            <img className="target-svgrepo-com" src={target} alt="Target" />
            <div className="frame-17">
              <p className="text-wrapper-9">
                Exercises on words memorized from books
              </p>
            </div>
            <div className="frame-18">
              <div
                className="frame-19"
                onClick={openMCQPage}
                style={{ cursor: "pointer" }}
              >
                <div className="text-wrapper-10">MCQ</div>
              </div>
              <div className="frame-20">
                <div className="text-wrapper-10">Flash card</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wordlist;
