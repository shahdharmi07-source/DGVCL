import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

import "../styles/hero.css";

function Hero() {

  const navigate = useNavigate();

  // Register Button
  const handleRegister = () => {
    navigate("/register");
  };

  // Login Button
  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <section className="hero">

      {/* ================= NAVBAR ================= */}

      <Navbar />


      {/* ================= HERO CONTENT ================= */}

      <div className="hero-content">

        {/* Hero Tag */}

        <div className="hero-tag">
          ⚡ SMART • DIGITAL • RELIABLE
        </div>


        {/* Main Heading */}

        <h1>
          Powering Gujarat
          <br />
          with <span>Smart Digital</span>
          <br />
          Services
        </h1>


        {/* Blue Line */}

        <div className="line"></div>


        {/* Description */}

        <p>
          DGPS (Digital Gujarat Power System) is your one-stop solution
          for all electricity related services.
          <strong> Safe. Simple. Smart.</strong>
        </p>


        {/* ================= BUTTONS ================= */}

        <div className="hero-buttons">

          {/* Register Button */}

          <button
            className="primary-btn"
            onClick={handleRegister}
          >
            ⚡ Get Started
          </button>


          {/* Login Button */}

          <button
            className="secondary-btn"
            onClick={handleLogin}
          >
            Existing Consumer Login →
          </button>

        </div>

      </div>


      {/* ================= QUICK SERVICE CARD ================= */}

      <div className="quick-card">

        {/* Card Header */}

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

          {/* Consumer Number */}

          <div className="input-group">

            <label>
              Consumer Number
            </label>

            <input
              type="text"
              placeholder="Enter Consumer Number"
            />

          </div>


          {/* Select Service */}

          <div className="input-group">

            <label>
              Select Service
            </label>

            <select>

              <option>
                Select Service
              </option>

              <option>
                Pay Bill
              </option>

              <option>
                View Bill
              </option>

              <option>
                Register Complaint
              </option>

              <option>
                New Connection
              </option>

            </select>

          </div>


          {/* Mobile Number */}

          <div className="input-group">

            <label>
              Mobile Number
            </label>

            <input
              type="text"
              placeholder="Enter Mobile Number"
            />

          </div>


          {/* Search Button */}

          <button
            className="search-btn"
          >
            🔍 Search
          </button>

        </div>

      </div>

    </section>
  );
}

export default Hero;