// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../services/userService";
import { isAuthenticated, logout } from "../../services/authService";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Chặn nếu chưa đăng nhập
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const me = await getMe();           // ⬅️ gọi qua service
        setUserData(me);
        setError("");
      } catch (err) {
        console.error("Error fetching user data:", err);
        const status = err?.response?.status;
        // Hết hạn/invalid token → logout và quay về login
        if (status === 401 || status === 404) {
          logout();
          navigate("/login");
          return;
        }
        setError("Không thể tải thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
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
            <p><strong>Số dư:</strong> {Number(userData.balance || 0).toLocaleString()} VND</p>
          </div>
        )}
      </div>
    </div>
  );
}
