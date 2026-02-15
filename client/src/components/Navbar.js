import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onLogout }) => {
  return (
    <nav style={{ padding: '15px 30px', backgroundColor: '#2c3e50', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0 }}>ExpenseTracker</h2>
      <div>
        {isAuthenticated ? (
          <button onClick={onLogout} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', marginRight: '20px', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
            <Link to="/signup" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;