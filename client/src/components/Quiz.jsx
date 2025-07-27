import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/quiz/questions');
        setQuestions(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setLoading(false);
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

      // Navigate to result page with result data
      navigate('/result', { state: { result: res.data } });

    } catch (err) {
      console.error('Error submitting quiz:', err);
      alert('Something went wrong while submitting the quiz.');
    }
  };

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Loading quiz questions...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="quiz-form">
      {questions.map((q, idx) => (
        <div key={idx} className="question-block">
          <p className="question-text">{q.question}</p>
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
