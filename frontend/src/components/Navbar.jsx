import React from "react";
import { Link } from "react-router-dom";
import { FaBolt, FaUserAlt } from "react-icons/fa";
import "../styles/navbar.css";

function Navbar() {
  return (
    <div className="navbar-wrapper">

      <header className="navbar">

        {/* Logo */}
        <div className="logo">
          <div className="logo-circle">
            <FaBolt />
          </div>

          <div className="logo-text">
            <h2>DGPS</h2>
            <span>Smart Consumer Portal</span>
          </div>
        </div>

        {/* Menu */}
        <nav className="nav-menu">
          <Link to="/" className="active">Home</Link>
          <Link to="/services">Service</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>

      </header>

      {/* Login Button (Navbar ke bahar) */}
      <Link to="/login" className="login-btn">
        <FaUserAlt />
        <span>Login</span>
      </Link>

    </div>
  );
}

export default Navbar;