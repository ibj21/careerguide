import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/quiz/questions');
        setQuestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionIndex, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(answers).length !== questions.length) {
      alert('Please answer all questions');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User not authenticated. Please log in.');
        return;
      }

      const res = await axios.post(
        'http://localhost:5000/api/quiz/submit',
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data);

      // Automatically redirect to profile after 3 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 3000);

    } catch (err) {
      console.error(err);
      alert('Error submitting quiz');
    }
  };

  if (result) {
    return (
      <div className="container">
        <div className="result">
          <h2>Your Career Guidance Result</h2>
          <p>{result.message}</p>
          <p>Redirecting to profile...</p>
          <button onClick={() => navigate('/profile')}>Go to Profile Now</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="quiz-form">
      {questions.map((q, idx) => (
        <div key={idx} className="question-block">
          <p>{q.question}</p>
          {q.options.map((option, oidx) => (
            <label key={oidx}>
              <input
                type="radio"
                name={`question-${idx}`}
                value={oidx}
                checked={answers[idx] === oidx}
                onChange={() => handleAnswerChange(idx, oidx)}
              />
              {option}
            </label>
          ))}
        </div>
      ))}
      <button className="submitbtn" type="submit">Submit Quiz</button>
    </form>
  );
};

export default Quiz;
