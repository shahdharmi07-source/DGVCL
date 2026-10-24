import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBolt,
  FaEnvelope,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";
import { toast } from "react-toastify";

import "../styles/adminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message || "Admin login failed"
        );
        return;
      }

      if (
        !data.admin ||
        data.admin.role !== "admin"
      ) {
        toast.error("Admin access denied");
        return;
      }

      localStorage.setItem(
        "adminUser",
        JSON.stringify(data.admin)
      );

      toast.success("Admin login successful");

      navigate("/admin-dashboard");

    } catch (error) {
      console.error(
        "Admin Login Error:",
        error
      );

      toast.error(
        "Unable to connect to server"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-wrapper">

        {/* LEFT IMAGE SECTION */}
        <div className="admin-login-image">

          <div className="image-overlay"></div>

          <div className="admin-image-content">

            <div className="image-logo">
              <FaBolt />
            </div>

            <span className="welcome-text">
              WELCOME TO
            </span>

            <h1>
              DGVCL
              <br />
              Admin Portal
            </h1>

            <p>
              Smart Electricity Management System
            </p>

            <div className="electricity-line">
              <span></span>
              <FaBolt />
              <span></span>
            </div>

          </div>

        </div>

        {/* RIGHT LOGIN SECTION */}
        <div className="admin-login-section">

          <div className="admin-login-card">

            <div className="admin-card-header">

              <div className="admin-logo">
                <FaBolt />
              </div>

              <h2>
                Admin Login
              </h2>

              <p>
                Sign in to manage your DGVCL portal
              </p>

            </div>

            <form onSubmit={handleLogin}>

              {/* EMAIL */}

              <div className="admin-field">

                <label>
                  Email Address
                </label>

                <div className="admin-input">

                  <FaEnvelope />

                  <input
                    type="email"
                    placeholder="Enter admin email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="admin-field">

                <label>
                  Password
                </label>

                <div className="admin-input">

                  <FaLock />

                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                  />

                </div>

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="admin-login-button"
                disabled={loading}
              >

                <span>
                  {loading
                    ? "Logging in..."
                    : "Login to Dashboard"}
                </span>

                {!loading && (
                  <FaArrowRight />
                )}

              </button>

            </form>

            {/* BACK BUTTON */}

            <button
              className="back-button"
              onClick={() =>
                navigate("/login")
              }
            >
              ← Back to Consumer Login
            </button>

            {/* SECURITY */}

            <div className="admin-security">

              <FaLock />

              <span>
                Secure Administrator Access
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;