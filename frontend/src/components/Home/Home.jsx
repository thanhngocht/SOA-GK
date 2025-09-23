import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        setUserData(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
        
        if (error.response?.status === 401 || error.response?.status === 404) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <nav className="navbar">
        <h1>iBanking Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
      </nav>
      
      <div className="user-info">
        <h2>Thông tin người dùng</h2>
        {userData && (
          <div className="info-card">
            <p><strong>Tên đăng nhập:</strong> {userData.username}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Họ tên:</strong> {userData.name}</p>
            <p><strong>Số dư:</strong> {userData.balance?.toLocaleString()} VND</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;