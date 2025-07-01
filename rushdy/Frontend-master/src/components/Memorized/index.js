import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./index.css";
import "./global.css";
import "./guide.css";
import logo from "../../assets/images/logo.png";
import face from "../../assets/icons/facebook.png";
import gmail from "../../assets/icons/gmail.png";
import instgram from "../../assets/icons/instgram.png";
import Sorting from "../../assets/icons/sorting.png";
import Book from "../../assets/images/book.png";
import Close from "../../assets/icons/close.png";
import Voice from "../../assets/icons/voice.png";

const API_BASE_URL = "http://app.elfar5a.com";
const USER_TOKEN = localStorage.getItem("authToken");

const Memorized = () => {
  // get data from end new request => wordlist
  // proxy CORS

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/wordlist/`, {
          headers: {
            Authorization: `Bearer ${USER_TOKEN}`,
            Accept: "application/json",
            "Cache-Control": "no-cache",
          },
        });
        console.log("BookDetail API Response:", response.data);
        // set your data here if needed
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    // one car css style mapping card componet
    <div>
      <div class="word-list-memorized">
        <div class="div">
          <div class="frame-wrapper">
            <div class="frame-8">
              <div class="frame-9">
                <div class="group">
                  <img class="group" src={logo} />
                </div>
                <p class="p">
                  OurStudio is a digital agency UI / UX Design and Website
                  Development located in Ohio, United States of America
                  OurStudio
                </p>
              </div>
              <div class="frame-9">
                <div class="text-wrapper-4">Follow Us</div>
                <div class="frame-10">
                  <div class="frame-11">
                    <img class="img-2" src={face} />
                    <p class="text-wrapper-5">8819 Ohio St. South Gate, CA</p>
                  </div>
                  <div class="frame-6">
                    <img class="img-2" src={gmail} />
                    <div class="text-wrapper-5">Ourstudio@hello.com</div>
                  </div>
                  <div class="frame-6">
                    <img class="img-2" src={instgram} />
                    <div class="text-wrapper-5">‪+1 386-688-3295‬</div>
                  </div>
                </div>
              </div>
              <div class="frame-12">
                <div class="div-wrapper">
                  <div class="text-wrapper-6">About us</div>
                </div>
                <div class="frame-13">
                  <div class="text-wrapper-6">Terms and Conditions</div>
                </div>
                <div class="frame-13">
                  <div class="text-wrapper-6">privacy policy</div>
                </div>
              </div>
            </div>
          </div>
          <div class="frame-14">
            <p class="text-wrapper-7">Word List &gt; Memorized Words</p>
            <div class="frame-15">
              <img class="img-2" src={Sorting} />
              <div class="text-wrapper-8">Sort by</div>
            </div>
          </div>
          <div class="frame-16">
            <div class="word-list-button-wrapper">
              <div class="word-list-button">
                <div class="frame-17">
                  <div class="frame-18">
                    <div class="frame-19">
                      <div class="frame-10">
                        <div class="text-wrapper-9">Said</div>
                        <div class="frame-20">
                          <div class="text-wrapper-10">Definition (verb):</div>
                          <p class="text-wrapper-11">
                            The past tense and past participle of say.
                          </p>
                          <div class="text-wrapper-12">Example:</div>
                          <p class="text-wrapper-11">
                            She said she would call me later.
                          </p>
                          <img class="line" src="img/line-1.svg" />
                          <div class="text-wrapper-12">
                            Definition (adjective):
                          </div>
                          <p class="text-wrapper-13">
                            Used in legal or formal language to refer to
                            something or someone already mentioned.
                          </p>
                          <div class="text-wrapper-12">Example:</div>
                          <p class="text-wrapper-11">
                            The said property was sold last year.
                          </p>
                          <div class="frame-21">
                            <img class="image" src={Book} />
                            <div class="text-wrapper-14">
                              Business Thinking for Designers
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="volume-high-wrapper">
                        <img class="img-2" src={Voice} />
                      </div>
                    </div>
                    <img class="img-2" src={Close} />
                  </div>
                </div>
              </div>
            </div>
            <div class="word-list-button-wrapper">
              <div class="word-list-button">
                <div class="frame-17">
                  <div class="frame-18">
                    <div class="frame-19">
                      <div class="frame-10">
                        <div class="text-wrapper-9">Said</div>
                        <div class="frame-20">
                          <div class="text-wrapper-10">Definition (verb):</div>
                          <p class="text-wrapper-11">
                            The past tense and past participle of say.
                          </p>
                          <div class="text-wrapper-12">Example:</div>
                          <p class="text-wrapper-11">
                            She said she would call me later.
                          </p>
                          <img class="line" src="img/image.svg" />
                          <div class="text-wrapper-12">
                            Definition (adjective):
                          </div>
                          <p class="text-wrapper-13">
                            Used in legal or formal language to refer to
                            something or someone already mentioned.
                          </p>
                          <div class="text-wrapper-12">Example:</div>
                          <p class="text-wrapper-11">
                            The said property was sold last year.
                          </p>
                          <div class="frame-21">
                            <img class="image" src={Book} />
                            <div class="text-wrapper-14">
                              Business Thinking for Designers
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="volume-high-wrapper">
                        <img class="img-2" src={Voice} />
                      </div>
                    </div>
                    <img class="img-2" src={Close} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="frame-22">
            <div class="word-list-button-wrapper">
              <div class="word-list-button">
                <div class="frame-17">
                  <div class="frame-18">
                    <div class="frame-19">
                      <div class="frame-10">
                        <div class="text-wrapper-9">Said</div>
                        <div class="frame-20">
                          <div class="text-wrapper-10">Definition (verb):</div>
                          <p class="text-wrapper-11">
                            The past tense and past participle of say.
                          </p>
                          <div class="text-wrapper-12">Example:</div>
                          <p class="text-wrapper-11">
                            She said she would call me later.
                          </p>
                          <img class="line" src="img/line-1-2.svg" />
                          <div class="text-wrapper-12">
                            Definition (adjective):
                          </div>
                          <p class="text-wrapper-13">
                            Used in legal or formal language to refer to
                            something or someone already mentioned.
                          </p>
                          <div class="text-wrapper-12">Example:</div>
                          <p class="text-wrapper-11">
                            The said property was sold last year.
                          </p>
                          <div class="frame-21">
                            <img class="image" src={Book} />
                            <div class="text-wrapper-14">
                              Business Thinking for Designers
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="volume-high-wrapper">
                        <img class="img-2" src={Voice} />
                      </div>
                    </div>
                    <img class="img-2" src={Close} />
                  </div>
                </div>
              </div>
            </div>
            <div class="word-list-button-wrapper">
              <div class="word-list-button">
                <div class="frame-17">
                  <div class="frame-18">
                    <div class="frame-19">
                      <div class="frame-10">
                        <div class="text-wrapper-9">Said</div>
                        <div class="frame-20">
                          <div class="text-wrapper-10">Definition (verb):</div>
                          <p class="text-wrapper-11">
                            The past tense and past participle of say.
                          </p>
                          <div class="text-wrapper-12">Example:</div>
                          <p class="text-wrapper-11">
                            She said she would call me later.
                          </p>
                          <img class="line" src="img/line-1-3.svg" />
                          <div class="text-wrapper-12">
                            Definition (adjective):
                          </div>
                          <p class="text-wrapper-13">
                            Used in legal or formal language to refer to
                            something or someone already mentioned.
                          </p>
                          <div class="text-wrapper-12">Example:</div>
                          <p class="text-wrapper-11">
                            The said property was sold last year.
                          </p>
                          <div class="frame-21">
                            <img class="image" src={Book} />
                            <div class="text-wrapper-14">
                              Business Thinking for Designers
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="volume-high-wrapper">
                        <img class="img-2" src={Voice} />
                      </div>
                    </div>
                    <img class="img-2" src={Close} />
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
export default Memorized;
