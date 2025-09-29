// src/pages/Home.jsx
import { useEffect, useState } from "react";
import React from 'react'
import { useNavigate } from "react-router-dom";
import { getMe } from "../../services/userService";
import { isAuthenticated, logout } from "../../services/authService";
import "./Home.css";

import LogoTDT from "../../assets/tdt_logo.png";
import Logout from "../../assets/Logout.png";





export default function Home(){
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("self")
  const [showOtherInfo, setShowOtherInfo] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [amount, setAmount] = useState(""); // số tiền nhập
  const [debt, setDebt] = useState(0);      // nợ kỳ trước
  const [mustPay, setMustPay] = useState(20); // tổng phải nộp ví dụ
  const [message, setMessage] = useState(""); // thông báo sau khi thanh toán
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpExpire, setOtpExpire] = useState(null);


 useEffect(() => {
  console.log("Render Home");
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

  const displayName = userData?.name ?? "";
  const displayId   = userData?.studentId ?? userData?.username ?? "";

 

  return (
    <>
    <header className="topbar">
      <div className="topbar__left">
        <img className="topbar__logo" src={LogoTDT} alt="TDTU Logo" />
        <h1 className="topbar__title">HỌC PHÍ - LỆ PHÍ</h1>
      </div>

      <div className="topbar__right">
        <span className="topbar__user">{displayName} ({displayId})</span>

        <button
          type="button"
          className="topbar__logout-btn"
          onClick={handleLogout}
          aria-label="Đăng xuất"
          title="Đăng xuất"
        >
          <img className="topbar__logout" src={Logout} alt="" />
        </button>
      </div>
    </header>





      <div className="divider"></div>

    <main className="container">
      {/* <!-- THÔNG TIN SINH VIÊN --> */}
    <section className="card">
      <div className="card__header">THÔNG TIN SINH VIÊN</div>
      <div className="grid grid--student">
        <div className="field">
          <label>MSSV</label>
          <input type="text" value={userData?.username ?? ""} disabled />
        </div>

        <div className="field">
          <label>Họ và tên</label>
          <input type="text" value={userData?.name ?? ""} disabled />
        </div>

        <div className="field">
          <label>Giới tính</label>
          <input
            type="text"
            value={
              userData?.gender === "male" ? "Nam"
              : userData?.gender === "female" ? "Nữ"
              : (userData?.gender ?? "")
            }
            disabled
          />
        </div>

        <div className="field field--wide">
          <label>Email</label>
          <input type="email" value={userData?.email ?? ""} disabled />
        </div>

        <div className="field">
          <label>Số điện thoại</label>
          <input type="text" value={userData?.phone ?? ""} disabled />
        </div>
      </div>
    </section>


      {/* <!-- Tabs --> */}
      <nav className="tabs">
          <button
            className={`tab ${activeTab === "self" ? "tab--active" : ""}`}
            type="button"
            onClick={() => setActiveTab("self")}
          >
            Thanh toán
          </button>
          <button
            className={`tab ${activeTab === "other" ? "tab--active" : ""}`}
            type="button"
            onClick={() => setActiveTab("other")}
          >
            Thanh toán cho người khác
          </button>
        </nav>

      {/* <!-- Học kỳ --> */}
      {activeTab === "self" && (
          <>
            {/* Khung thanh toán cho chính mình */}
            <section className="row">
              <div className="field field--select">
                <label>Học kỳ</label>
                <select>
                  <option defaultValue>Chọn học kỳ</option>
                  <option>HK1 (2024-2025)</option>
                  <option>HK2 (2024-2025)</option>
                  <option>HK3 (2024-2025)</option>
                </select>
              </div>
            </section>

          {/* <!-- Học phí --> */}
          <section className="card">
            <div className="card__subtabs">
              <button className="subtab subtab--active" type="button">Học phí</button>
              <button
                className="subtab subtab--link"
                type="button"
                onClick={() => setShowGuide(true)}
              >
                Hướng dẫn thanh toán học phí
              </button>

            </div>

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      NỢ KỲ TRƯỚC
                      <br />
                      <span className="muted">(1)</span>
                    </th>
                    <th>
                      HỌC PHÍ HỌC KỲ
                      <br />
                      <span className="muted">(2)</span>
                    </th>
                    <th>
                      MIỄN GIẢM
                      <br />
                      <span className="muted">(3)</span>
                    </th>
                    <th>
                      TỔNG HỌC PHÍ PHẢI NỘP
                    </th>
                    <th>
                      TỔNG HỌC PHÍ ĐÃ NỘP
                      <br />
                      <span className="muted">(5)</span>
                    </th>
                    <th>
                      SỐ TIỀN CÒN PHẢI NỘP
                      <br />
                      <span className="muted">(6) = (4) - (5)</span>
                    </th>
                    <th>
                      GHI CHÚ
                      <br />
                      <span className="muted">(7)</span>
                    </th>
                  </tr>

                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* <!-- Danh sách môn học tính phí --> */}
          <section className="card">
            <h2 className="section-title">Danh sách môn học tính phí trong học kỳ</h2>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>MÃ MÔN HỌC</th>
                    <th>TÊN MÔN HỌC</th>
                    <th>NGÀY ĐĂNG KÍ MÔN HỌC</th>
                    <th>SỐ TIỀN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colSpan="4" className="empty">— Chưa có dữ liệu —</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* <!-- Danh sách môn học chưa tính phí --> */}
          <section className="card">
            <h2 className="section-title">Danh sách môn học chưa tính phí trong học kỳ</h2>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>MÃ MÔN HỌC</th>
                    <th>TÊN MÔN HỌC</th>
                    <th>NGÀY ĐĂNG KÍ MÔN HỌC</th>
                    <th>SỐ TIỀN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colSpan="4" className="empty">— Chưa có dữ liệu —</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* <!-- Lịch sử thanh toán --> */}
          <section className="card">
            <h2 className="section-title">Lịch sử thanh toán</h2>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>NGÀY THANH TOÁN</th>
                    <th>SỐ TIỀN</th>
                    <th>NGƯỜI NỘP TIỀN</th>
                    <th>GHI CHÚ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colSpan="4" className="empty">— Chưa có lịch sử —</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className="center">
            <button
              className="btn btn--primary"
              type="button"
              onClick={() => setShowPay(true)}
            >
              Thanh toán
            </button>
          </div>
        </>
      )}
      {activeTab === "other" && (
          <>
            {!showOtherInfo && (
              <section className="card">
                <div className="field">
                  <label>Nhập MSSV cần thanh toán hộ</label>
                  <input type="text" placeholder="Nhập MSSV..." />
                </div>
                <div className="center">
                  <button
                    className="btn btn--primary"
                    onClick={() => setShowOtherInfo(true)}
                  >
                    Tìm sinh viên
                  </button>
                </div>
              </section>
            )}

            {showOtherInfo && (
              <>
                {/* Thông tin người được nộp hộ */}
                <section className="card">
                  <div className="grid grid--two">
                    <div className="field">
                      <label>MSSV</label>
                      <input type="text" value="52200999" readOnly />
                    </div>
                    <div className="field">
                      <label>Họ và tên</label>
                      <input type="text" value="Nguyen Van B" readOnly />
                    </div>
                  </div>
                </section>

                {/* Học kỳ hiện tại */}
                <section className="pill-row">
                  <div className="pill">
                    <span className="pill__label">Học kỳ hiện tại</span>
                    <span className="pill__value"> HK1/2025-2026</span>
                  </div>
                </section>

                {/* Học phí */}
                <section className="card">
                  <div className="card__subtabs">
                    <button className="subtab subtab--active">Học phí</button>
                    <button
                      className="subtab subtab--link"
                      type="button"
                      onClick={() => setShowGuide(true)}
                    >
                      Hướng dẫn thanh toán học phí
                    </button>
                  </div>

                  <div className="table-wrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>NỢ KỲ TRƯỚC</th>
                          <th>HỌC PHÍ HỌC KỲ</th>
                          <th>MIỄN GIẢM</th>
                          <th>TỔNG PHẢI NỘP</th>
                          <th>ĐÃ NỘP</th>
                          <th>CÒN NỢ</th>
                          <th>GHI CHÚ</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td>0</td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Danh sách môn học tính phí */}
                <section className="card">
                  <h2 className="section-title">Danh sách môn học tính phí</h2>
                  <div className="table-wrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>MÃ MÔN HỌC</th>
                          <th>TÊN MÔN HỌC</th>
                          <th>NGÀY ĐK</th>
                          <th>SỐ TIỀN</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan="4" className="empty">
                            — Chưa có dữ liệu —
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Lịch sử thanh toán */}
                <section className="card">
                  <h2 className="section-title">Lịch sử thanh toán</h2>
                  <div className="table-wrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>NGÀY THANH TOÁN</th>
                          <th>SỐ TIỀN</th>
                          <th>NGƯỜI NỘP</th>
                          <th>GHI CHÚ</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan="4" className="empty">
                            — Chưa có lịch sử —
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <div className="center">
                  <button
                    className="btn btn--primary"
                    type="button"
                    onClick={() => setShowPay(true)}
                  >
                    Thanh toán
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {showGuide && (
          <div className="modal">
            <div className="modal-content">
              <h3>Hướng dẫn thanh toán học phí</h3>
              <p>1. Chọn học kỳ muốn thanh toán.</p>
              <p>2. Kiểm tra số tiền còn nợ và danh sách môn học.</p>
              <p>3. Nhấn nút <b>Thanh toán</b> để chuyển sang cổng thanh toán.</p>
              <p>4. Hoàn tất giao dịch và chờ xác nhận từ hệ thống.</p>
              <div className="center">
                <button className="btn btn--primary" onClick={() => setShowGuide(false)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {showPay && (
          <div className="modal">
            <div className="modal-content">
              <h3>Nhập số tiền thanh toán</h3>
              <input
                type="number"
                placeholder="Nhập số tiền"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <div className="center" style={{marginTop:"16px"}}>
                <button
                  className="btn btn--primary"
                  onClick={() => {
                    if (amount < mustPay) {
                      setMessage("❌ Không đủ tiền để thanh toán.");
                      setShowPay(false);
                      return;
                    }
                    // sinh mã OTP ngẫu nhiên 6 số
                    const code = Math.floor(100000 + Math.random() * 900000).toString();
                    setGeneratedOtp(code);
                    setOtpExpire(Date.now() + 3 * 60 * 1000); // hết hạn sau 3 phút
                    console.log("OTP gửi qua email:", code); // giả lập gửi email
                    setShowPay(false);
                    setShowOtp(true);
                  }}
                >
                  Xác nhận
                </button>
                <button className="btn" onClick={() => setShowPay(false)}>
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="modal">
            <div className="modal-content">
              <p>{message}</p>
              <p>Nợ kỳ trước hiện tại: {debt}</p>
              <div className="center">
                <button className="btn btn--primary" onClick={() => setMessage("")}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      {showOtp && (
        <div className="modal">
          <div className="modal-content">
            <h3>Nhập mã OTP (hết hạn sau 3 phút)</h3>
            <input
              type="text"
              placeholder="Nhập OTP..."
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <div className="center" style={{marginTop:"16px"}}>
              <button
                className="btn btn--primary"
                onClick={() => {
                  if (!generatedOtp || Date.now() > otpExpire) {
                    setMessage("❌ OTP đã hết hạn, vui lòng thử lại.");
                  } else if (otp !== generatedOtp) {
                    setMessage("❌ Mã OTP không đúng.");
                  } else {
                    const surplus = amount - mustPay;
                    setDebt(debt + surplus);
                    setMessage("✅ Thanh toán thành công!");
                  }
                  setShowOtp(false);
                }}
              >
                Xác nhận OTP
              </button>
              <button className="btn" onClick={() => setShowOtp(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
    <footer className="footer">
      <p>© 2025 Nhom 9. All rights reserved.</p>
    </footer>

    </>
  )
}



