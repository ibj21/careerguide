import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return <p>No result to display. Please take the quiz first.</p>;
  }

  return (
    <div className="container">
      <div className="result">
        <h2>Your Career Guidance Result</h2>
        <p>{result.message}</p>
        <button onClick={() => navigate('/profile')}>Go to Profile Now</button>
      </div>
    </div>
  );
};

export default Result;
