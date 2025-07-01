import React, { useState, useEffect } from "react";
import axios from "axios";
import "../MCQ/index.css";
import "../MCQ/guide.css";
import "../MCQ/global.css";
import logo from "../../assets/images/logo.png";
import face from "../../assets/icons/facebook.png";
import gmail from "../../assets/icons/gmail.png";
import instgram from "../../assets/icons/instgram.png";

const MCQ = () => {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = "http://app.elfar5a.com";

  // Start quiz
  const startQuiz = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token found in localStorage");

      const response = await axios.post(
        `${baseUrl}/api/quiz/start`,
        {
          type: "multiple_choice",
          document_id: 1,
          question_count: 5,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000, // Reduced to 5 seconds
        }
      );
      setQuiz(response.data.data.quiz);
      console.log("Quiz started:", response.data.data.quiz);
    } catch (err) {
      setError(`Failed to start quiz: ${err.message}`);
      setLoading(false);
    }
  };

  // Fetch questions
  const fetchQuestions = async (quizId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token found in localStorage");

      const response = await axios.get(`${baseUrl}/api/quiz/${quizId}/questions`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000, // Reduced to 5 seconds
      });
      const fetchedQuestions = response.data.data.questions;
      setQuestions(fetchedQuestions);
      console.log("Fetched questions:", fetchedQuestions);
      if (fetchedQuestions.length === 0) {
        setError("No questions available for this quiz.");
      }
    } catch (err) {
      setError(`Failed to fetch questions: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Submit answer
  const submitAnswer = async (questionId, answer) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token found in localStorage");

      const response = await axios.post(
        `${baseUrl}/api/quiz/question/${questionId}/answer`,
        { answer },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000, // Reduced to 5 seconds
        }
      );
      console.log("Answer submitted:", response.data);
      return true;
    } catch (err) {
      if (err.response?.data?.message === "Question already answered") {
        console.log("Question already answered, skipping...");
        return false; // Allow skipping to next question
      }
      setError(`Failed to submit answer: ${err.message}`);
      return false;
    }
  };

  // Fetch results
  const fetchResults = async (quizId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token found in localStorage");

      const response = await axios.get(`${baseUrl}/api/quiz/${quizId}/results`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000, // Reduced to 5 seconds
      });
      setResults(response.data.data);
      console.log("Fetched results:", response.data.data);
    } catch (err) {
      setError(`Failed to fetch results: ${err.message}`);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  // Handle next question or finish quiz
  const handleNext = async () => {
    if (selectedAnswer === null) {
      setError("Please select an answer before proceeding.");
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const success = await submitAnswer(currentQuestion.id, selectedAnswer);

    if (success || !success) { // Proceed even if question was already answered
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setError(null);
      } else {
        await fetchResults(quiz.id);
      }
    }
  };

  // Initialize quiz
  useEffect(() => {
    const initQuiz = async () => {
      setLoading(true);
      await startQuiz();
    };
    initQuiz();
  }, []);

  // Fetch questions when quiz is started
  useEffect(() => {
    if (quiz?.id) {
      fetchQuestions(quiz.id);
    }
  }, [quiz]);

  if (loading) return <div>Loading...</div>;

  if (error) {
    return (
      <div>
        Error: {error}
        <button onClick={() => { setError(null); setLoading(true); startQuiz(); }} style={{ marginLeft: "10px" }}>
          Retry
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div>
        <div className="word-list-word">
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
                  <div className="div-wrapper"><div className="text-wrapper-6">About us</div></div>
                  <div className="frame-13"><div className="text-wrapper-6">Terms and Conditions</div></div>
                  <div className="frame-13"><div className="text-wrapper-6">Privacy Policy</div></div>
                </div>
              </div>
            </div>
            <div className="word-list-word-wrapper">
              <p className="text-wrapper-7">Word List > Word exercises > MCQ</p>
            </div>
            <div className="frame-14">
              <div className="frame-15">
                <div className="frame-16"><div className="frame-17"></div></div>
              </div>
              <div className="frame-18">
                <p className="in-the-book-it-said">
                  No questions available for this quiz.
                </p>
                <div className="frame-19">
                  <div className="select-bottun">
                    <div className="frame-20">
                      <div className="text-wrapper-8">Please try starting a new quiz.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="frame-21">
              <div className="frame-22">
                <div className="text-wrapper-9" onClick={() => { setError(null); setLoading(true); startQuiz(); }}>
                  Start New Quiz
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <div>
        <div className="word-list-word">
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
                  <div className="div-wrapper"><div className="text-wrapper-6">About us</div></div>
                  <div className="frame-13"><div className="text-wrapper-6">Terms and Conditions</div></div>
                  <div className="frame-13"><div className="text-wrapper-6">Privacy Policy</div></div>
                </div>
              </div>
            </div>
            <div className="word-list-word-wrapper">
              <p className="text-wrapper-7">Word List > Word exercises > MCQ</p>
            </div>
            <div className="frame-14">
              <div className="frame-15">
                <div className="frame-16"><div className="frame-17"></div></div>
              </div>
              <div className="frame-18">
                <p className="in-the-book-it-said">
                  Quiz Results
                </p>
                <div className="frame-19">
                  <div className="select-bottun">
                    <div className="frame-20">
                      <div className="text-wrapper-8">
                        Score: {results.summary.score_percentage}%
                      </div>
                    </div>
                  </div>
                  <div className="select-bottun-2">
                    <div className="frame-20">
                      <div className="text-wrapper-8">
                        Correct Answers: {results.summary.correct_answers}/{results.summary.total_questions}
                      </div>
                    </div>
                  </div>
                  <div className="select-bottun-2">
                    <div className="frame-20">
                      <div className="text-wrapper-8">
                        Wrong Answers: {results.summary.wrong_answers}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="frame-21">
              <div className="frame-22">
                <div className="text-wrapper-9" onClick={() => { setResults(null); setCurrentQuestionIndex(0); setLoading(true); startQuiz(); }}>
                  Restart Quiz
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <div className="word-list-word">
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
                <div className="div-wrapper"><div className="text-wrapper-6">About us</div></div>
                <div className="frame-13"><div className="text-wrapper-6">Terms and Conditions</div></div>
                <div className="frame-13"><div className="text-wrapper-6">Privacy Policy</div></div>
              </div>
            </div>
          </div>
          <div className="word-list-word-wrapper">
            <p className="text-wrapper-7">Word List > Word exercises > MCQ</p>
          </div>
          <div className="frame-14">
            <div className="frame-15">
              <div className="frame-16"><div className="frame-17"></div></div>
            </div>
            <div className="frame-18">
              <p className="in-the-book-it-said">
                {currentQuestion?.question_text || "Loading question..."}
              </p>
              <div className="frame-19">
                {currentQuestion?.options?.map((option, index) => (
                  <div
                    className={`select-bottun${index === 0 ? "" : "-2"}`}
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    style={{
                      backgroundColor: selectedAnswer === option ? "#d3d3d3" : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <div className="frame-20">
                      <div className="text-wrapper-8">{option}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="frame-21">
            <div className="frame-22">
              <div className="text-wrapper-9" onClick={handleNext}>
                Next
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCQ;