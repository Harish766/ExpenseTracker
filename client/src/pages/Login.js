import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // UPDATED: Changed from /api/users/login to /api/auth/login
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      onLogin(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || 'Check credentials'));
    }
  };

  return (
    <div className="auth-form" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" placeholder="Email" required style={{ padding: '10px' }}
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" placeholder="Password" required style={{ padding: '10px' }}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit" style={{ padding: '10px', background: '#3498db', color: 'white', border: 'none', cursor: 'pointer' }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;