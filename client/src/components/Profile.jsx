import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get(`http://localhost:5000/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <div className="profile-container">
      

      {/* 👤 Profile Box */}
      <div className="profile-box">
        <h2>User Profile</h2>
        {user ? (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Predicted Career:</strong> {user.predictedCareer}</p>

            <button
              onClick={() => navigate('/quiz')}
              className="profile-button quiz-button"
            >
              Go to Quizzes
            </button>

            <button
              onClick={handleLogout}
              className="profile-button logout-button"
            >
              Logout
            </button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {/* 🔘 Additional Buttons Outside Profile Box */}
      <div className="top-buttons">
        <button onClick={() => navigate('/chatbot')} className="extra-button">
          Ask AI Chatbot
        </button>
        <button
        onClick={() => {
    if (user?.predictedCareer) {
      navigate(`/path-recommendations/${encodeURIComponent(user.predictedCareer)}`);
    } else {
      alert("No career prediction found!");
    }
      }}
    className="extra-button"
>
  See Recommendations by Career Path
</button>


      </div>
    </div>
  );
};

export default Profile;
