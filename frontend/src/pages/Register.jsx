import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/register.css";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    consumerNumber: "",
    meterNumber: "",
    mobile: "",
    address: "",
    email: ""
  });

  const [message, setMessage] = useState("");


  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };


  // ==========================================
  // REGISTER USER
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");


    // ==========================================
    // REQUIRED FIELD CHECK
    // ==========================================

    if (
      !formData.name ||
      !formData.consumerNumber ||
      !formData.meterNumber ||
      !formData.mobile ||
      !formData.address
    ) {

      setMessage(
        "Please fill all required fields."
      );

      return;

    }


    try {

      // ==========================================
      // REGISTER USER IN MONGODB
      // ==========================================

      const response = await fetch(

        "http://localhost:5000/api/users/register",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify(formData)

        }

      );


      const data = await response.json();


      // ==========================================
      // REGISTRATION SUCCESS
      // ==========================================

      if (response.ok) {

        setMessage(
          "Registration Successful! Please Login."
        );


        // Save consumer number
        // for future login/dashboard use

        localStorage.setItem(

          "consumerNumber",

          formData.consumerNumber

        );


        // Clear form

        setFormData({

          name: "",

          consumerNumber: "",

          meterNumber: "",

          mobile: "",

          address: "",

          email: ""

        });


      } else {

        setMessage(

          data.message ||
          "Registration Failed"

        );

      }


    } catch (error) {

      console.error(

        "REGISTER ERROR:",

        error

      );


      setMessage(

        "Backend server is not connected."

      );

    }

  };


  return (

    <div className="register-page">

      <div className="register-card">


        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="register-header">

          <h1>DGPS</h1>

          <h2>Create Consumer Account</h2>

          <p>

            Register for Smart Electricity Consumer Portal

          </p>

        </div>


        {/* ==========================================
            MESSAGE
        ========================================== */}

        {message && (

          <div className="register-message">

            {message}

          </div>

        )}


        {/* ==========================================
            REGISTER FORM
        ========================================== */}

        <form onSubmit={handleSubmit}>


          {/* FULL NAME */}

          <div className="form-group">

            <label>

              Full Name

            </label>

            <input

              type="text"

              name="name"

              placeholder="Enter your full name"

              value={formData.name}

              onChange={handleChange}

            />

          </div>


          {/* CONSUMER NUMBER */}

          <div className="form-group">

            <label>

              Consumer Number

            </label>

            <input

              type="text"

              name="consumerNumber"

              placeholder="Enter consumer number"

              value={formData.consumerNumber}

              onChange={handleChange}

            />

          </div>


          {/* METER NUMBER */}

          <div className="form-group">

            <label>

              Meter Number

            </label>

            <input

              type="text"

              name="meterNumber"

              placeholder="Enter meter number"

              value={formData.meterNumber}

              onChange={handleChange}

            />

          </div>


          {/* MOBILE */}

          <div className="form-group">

            <label>

              Mobile Number

            </label>

            <input

              type="tel"

              name="mobile"

              placeholder="Enter mobile number"

              value={formData.mobile}

              onChange={handleChange}

            />

          </div>


          {/* ADDRESS */}

          <div className="form-group">

            <label>

              Address

            </label>

            <textarea

              name="address"

              placeholder="Enter your address"

              value={formData.address}

              onChange={handleChange}

            ></textarea>

          </div>


          {/* EMAIL */}

          <div className="form-group">

            <label>

              Email

            </label>

            <input

              type="email"

              name="email"

              placeholder="Enter email address"

              value={formData.email}

              onChange={handleChange}

            />

          </div>


          {/* REGISTER BUTTON */}

          <button

            type="submit"

            className="register-btn"

          >

            Create Account

          </button>


        </form>


        {/* ==========================================
            LOGIN
        ========================================== */}

        <div className="login-text">

          Already have an account?


          <button

            type="button"

            onClick={() => navigate("/login")}

          >

            Login

          </button>

        </div>


      </div>

    </div>

  );

}

export default Register;