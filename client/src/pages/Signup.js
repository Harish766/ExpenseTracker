import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // UPDATED: Changed from /api/users/signup to /api/auth/signup
      await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
      alert('Signup successful! Please login.');
      navigate('/login'); 
    } catch (err) {
      alert('Signup failed: ' + (err.response?.data?.message || 'Check credentials'));
    }
  };

  return (
    <div className="auth-form" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} required style={{ padding: '10px' }} />
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required style={{ padding: '10px' }}/>
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required style={{ padding: '10px' }}/>
        <button type="submit" style={{ padding: '10px', background: '#2ecc71', color: 'white', border: 'none', cursor: 'pointer' }}>Sign Up</button>
      </form>
      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Signup;