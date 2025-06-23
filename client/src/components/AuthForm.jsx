import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

function AuthForm() {
  const [page, setPage] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', formData);
      setMessage(res.data.message);
      setPage('login');
      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleLogin = async (e) => {
   e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/users/login', {
      email: formData.email,
      password: formData.password,
    });
    setMessage(`Welcome!`);
    localStorage.setItem('token', res.data.token);  // Save token here
    navigate('/profile');
  } catch (err) {
    setMessage(err.response?.data?.message || 'Login failed');
  }
  };

  return (
    <div className="auth-container">
       <h2 className='auth-title'>CAREERGUIDE</h2>
  <div className="auth-box">
   
    <h2>{page === 'login' ? 'Login' : 'Register'}</h2>
    <form onSubmit={page === 'login' ? handleLogin : handleRegister}>
      {page === 'register' && (
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      )}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">
        {page === 'login' ? 'Login' : 'Register'}
      </button>
    </form>

    <p className="auth-toggle">
      {page === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
      <span
        onClick={() => {
          setPage(page === 'login' ? 'register' : 'login');
          setMessage('');
          setFormData({ name: '', email: '', password: '' });
        }}
      >
        {page === 'login' ? 'Register here' : 'Login here'}
      </span>
    </p>

    {message && <p className="auth-message">{message}</p>}
  </div>
</div>

  );
}

export default AuthForm;
