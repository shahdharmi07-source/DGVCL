import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

import "../styles/hero.css";

function Hero() {
  const navigate = useNavigate();

  // ================= STATES =================

  const [consumerNumber, setConsumerNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [service, setService] = useState("");

  // ================= REGISTER =================

  const handleRegister = () => {
    navigate("/register");
  };

  // ================= ADMIN LOGIN =================

  const handleAdminLogin = () => {
    navigate("/admin-login");
  };

  // ================= QUICK SERVICE =================

  const handleSearch = () => {
    if (!consumerNumber || !mobileNumber || !service) {
      alert(
        "Please enter Consumer Number, Mobile Number and select a Service."
      );
      return;
    }

    if (service === "Pay Bill") {
      navigate("/paybill");
      return;
    }

    if (service === "View Bill") {
      navigate("/bills");
      return;
    }

    if (service === "Register Complaint") {
      navigate("/complaint");
      return;
    }

    if (service === "New Connection") {
      navigate("/new-connection");
      return;
    }

    alert("Please select a valid service.");
  };

  return (
    <section className="hero">

      {/* ================= NAVBAR ================= */}

      <Navbar />

      {/* ================= HERO CONTENT ================= */}

      <div className="hero-content">

        {/* HERO TAG */}

        <div className="hero-tag">
          ⚡ SMART • DIGITAL • RELIABLE
        </div>

        {/* MAIN HEADING */}

        <h1>
          Powering Gujarat
          <br />
          with <span>Smart Digital</span>
          <br />
          Services
        </h1>

        {/* BLUE LINE */}

        <div className="line"></div>

        {/* DESCRIPTION */}

        <p>
          DGPS (Digital Gujarat Power System) is your one-stop solution
          for all electricity related services.
          <strong> Safe. Simple. Smart.</strong>
        </p>

        {/* ================= BUTTONS ================= */}

        <div className="hero-buttons">

          {/* REGISTER BUTTON */}

          <button
            className="primary-btn"
            onClick={handleRegister}
          >
            ⚡ Get Started
          </button>

          {/* ADMIN LOGIN BUTTON */}

          <button
            className="secondary-btn"
            onClick={handleAdminLogin}
          >
            🔐 Admin Login →
          </button>

        </div>

      </div>

      {/* ================= QUICK SERVICE CARD ================= */}

      <div className="quick-card">

        {/* CARD HEADER */}

        <div className="card-header">

          <div className="icon-box">
            ⚡
          </div>

          <div>
            <h2>
              Quick Service
            </h2>

            <p>
              Find and access our services quickly
            </p>
          </div>

        </div>

        {/* ================= FORM ================= */}

        <div className="card-form">

          {/* CONSUMER NUMBER */}

          <div className="input-group">

            <label>
              Consumer Number
            </label>

            <input
              type="text"
              placeholder="Enter Consumer Number"
              value={consumerNumber}
              onChange={(e) =>
                setConsumerNumber(e.target.value)
              }
            />

          </div>

          {/* SELECT SERVICE */}

          <div className="input-group">

            <label>
              Select Service
            </label>

            <select
              value={service}
              onChange={(e) =>
                setService(e.target.value)
              }
            >

              <option value="">
                Select Service
              </option>

              <option value="Pay Bill">
                Pay Bill
              </option>

              <option value="View Bill">
                View Bill
              </option>

              <option value="Register Complaint">
                Register Complaint
              </option>

              <option value="New Connection">
                New Connection
              </option>

            </select>

          </div>

          {/* MOBILE NUMBER */}

          <div className="input-group">

            <label>
              Mobile Number
            </label>

            <input
              type="text"
              placeholder="Enter Mobile Number"
              value={mobileNumber}
              onChange={(e) =>
                setMobileNumber(e.target.value)
              }
            />

          </div>

          {/* SEARCH BUTTON */}

          <button
            className="search-btn"
            onClick={handleSearch}
          >
            🔍 Search
          </button>

        </div>

      </div>

    </section>
  );
}

export default Hero;