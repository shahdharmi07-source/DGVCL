import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaBolt,
  FaArrowLeft
} from "react-icons/fa";

import "../styles/login.css";
import loginImage from "../styles/img2.png";
import "../styles/img3.jpg";


function Login() {

  const navigate = useNavigate();

  const [consumerNumber, setConsumerNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  // ==========================================
  // GENERATE OTP
  // ==========================================

  const handleGenerateOTP = async () => {

    setMessage("");

    // Check Consumer Number
    if (consumerNumber.trim() === "") {

      setMessage("Please enter Consumer Number.");

      return;
    }


    try {

      setLoading(true);

      console.log(
        "Checking Consumer Number:",
        consumerNumber
      );


      // ==========================================
      // CHECK USER FROM BACKEND
      // ==========================================

      const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            consumerNumber: consumerNumber.trim()
          })
        }
      );


      const data = await response.json();


      console.log(
        "Backend Response:",
        data
      );


      // ==========================================
      // LOGIN SUCCESS
      // ==========================================

      if (response.ok) {

        // Save User Data
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify(data.user)
        );


        // Save Consumer Number
        localStorage.setItem(
          "consumerNumber",
          consumerNumber.trim()
        );


        // ==========================================
        // GENERATE DEMO OTP
        // ==========================================

        const randomOTP = Math.floor(
          100000 + Math.random() * 900000
        ).toString();


        // Save OTP
        localStorage.setItem(
          "demoOTP",
          randomOTP
        );


        // Show Demo OTP
        alert(
          "Your Demo OTP is: " + randomOTP
        );


        // Go To OTP Page
        navigate("/otp");


      } else {

        // Login Failed
        setMessage(
          data.message ||
          "Consumer not registered."
        );
      }


    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      setMessage(
        "Backend server is not connected."
      );


    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="login-page">


      {/* =====================================
          LOGIN CONTAINER
      ===================================== */}

      <div className="login-container">


        {/* =====================================
            LEFT SIDE
        ===================================== */}

        <div className="login-left">

          <img
            src={loginImage}
            alt="Electricity Illustration"
          />

        </div>


        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <div className="login-right">


          {/* =====================================
              LOGO
          ===================================== */}

          <div className="login-logo">

            <div className="logo-circle">

              <FaBolt />

            </div>

          </div>


          {/* =====================================
              TITLE
          ===================================== */}

          <h1>
            Consumer Login
          </h1>


          <p className="login-subtitle">

            Welcome Back! Login to access
            your electricity services securely.

          </p>


          {/* =====================================
              MESSAGE
          ===================================== */}

          {message && (

            <div className="login-message">

              {message}

            </div>

          )}


          {/* =====================================
              LOGIN FORM
          ===================================== */}

          <div className="login-form">


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


            {/* =================================
                OTP BUTTON
            ================================= */}

            <button
              type="button"
              className="otp-btn"
              onClick={handleGenerateOTP}
              disabled={loading}
            >

              {loading
                ? "Checking..."
                : "Generate OTP"
              }

            </button>


            <p className="otp-info">

              OTP will be sent to your
              registered mobile number.

            </p>


          </div>


          {/* =====================================
              REGISTER
          ===================================== */}

          <div className="register-link">

            <span>
              New Consumer?
            </span>


            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
            >
              Register Here
            </button>

          </div>


          {/* =====================================
              BACK TO HOME
          ===================================== */}

          <Link
            to="/"
            className="back-home"
          >

            <FaArrowLeft />

            <span>
              Back to Home
            </span>

          </Link>


        </div>

      </div>

    </div>

  );

}


export default Login;