import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBolt, FaUserAlt } from "react-icons/fa";

import "../styles/navbar.css";

function Navbar() {
  const location = useLocation();

  return (
    <div className="navbar-wrapper">

      <header className="navbar">

        {/* ==============================
            LOGO
        ============================== */}

        <Link to="/" className="logo">

          <div className="logo-circle">
            <FaBolt />
          </div>

          <div className="logo-text">
            <h2>DGPS</h2>
            <span>Smart Consumer Portal</span>
          </div>

        </Link>


        {/* ==============================
            NAVIGATION MENU
        ============================== */}

        <nav className="nav-menu">

          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
          >
            Home
          </Link>

          <Link
            to="/services"
            className={
              location.pathname === "/services"
                ? "active"
                : ""
            }
          >
            Services
          </Link>

          <Link
            to="/about"
            className={
              location.pathname === "/about"
                ? "active"
                : ""
            }
          >
            About Us
          </Link>

          <Link
            to="/contact"
            className={
              location.pathname === "/contact"
                ? "active"
                : ""
            }
          >
            Contact Us
          </Link>

        </nav>


        {/* ==============================
            LOGIN BUTTON
        ============================== */}

        <Link
          to="/login"
          className={
            location.pathname === "/login"
              ? "login-btn active-login"
              : "login-btn"
          }
        >

          <FaUserAlt />

          <span>Login</span>

        </Link>

      </header>

    </div>
  );
}

export default Navbar;