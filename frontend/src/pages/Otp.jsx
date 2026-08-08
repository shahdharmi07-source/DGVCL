import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBolt, FaArrowLeft } from "react-icons/fa";

import "../styles/otp.css";

function Otp() {

  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  const [generatedOtp, setGeneratedOtp] = useState("");

  const [countdown, setCountdown] = useState(30);

  const [loading, setLoading] = useState(false);


  // ==========================================
  // LOAD OTP
  // ==========================================

  useEffect(() => {

    const savedOtp =
      localStorage.getItem("demoOTP");

    if (savedOtp) {

      setGeneratedOtp(savedOtp);

    }

  }, []);


  // ==========================================
  // TIMER
  // ==========================================

  useEffect(() => {

    if (countdown === 0) {

      return;

    }

    const timer = setTimeout(() => {

      setCountdown(countdown - 1);

    }, 1000);


    return () => {

      clearTimeout(timer);

    };

  }, [countdown]);


  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerifyOTP = async () => {

    // ==========================================
    // CHECK OTP
    // ==========================================

    if (otp.trim() === "") {

      alert("Please Enter OTP");

      return;

    }


    // ==========================================
    // INVALID OTP
    // ==========================================

    if (otp !== generatedOtp) {

      alert("Invalid OTP");

      return;

    }


    // ==========================================
    // GET CONSUMER NUMBER
    // ==========================================

    const consumerNumber =
      localStorage.getItem("consumerNumber");


    if (!consumerNumber) {

      alert(
        "Consumer information not found. Please login again."
      );

      navigate("/login");

      return;

    }


    try {

      setLoading(true);


      // ==========================================
      // CHECK EXISTING BILLS
      // ==========================================

      const billResponse = await fetch(

        `http://localhost:5000/api/bills/${consumerNumber}`

      );


      if (!billResponse.ok) {

        throw new Error(
          "Unable to check existing bills"
        );

      }


      const billData =
        await billResponse.json();


      const existingBills =
        billData.bills || [];


      // ==========================================
      // IF BILL ALREADY EXISTS
      // ==========================================

      if (existingBills.length > 0) {

        alert(
          "OTP Verified Successfully!"
        );

        localStorage.removeItem(
          "demoOTP"
        );

        navigate("/dashboard");

        return;

      }


      // ==========================================
      // CURRENT DATE
      // ==========================================

      const currentDate =
        new Date();


      // ==========================================
      // MONTH
      // ==========================================

      const month =
        currentDate.toLocaleString(

          "default",

          {
            month: "long",
            year: "numeric"
          }

        );


      // ==========================================
      // BILL NUMBER
      // ==========================================

      const billNumber =

        "DGPS-" +

        Date.now();


      // ==========================================
      // SIMULATED METER READINGS
      // ==========================================

      // Academic Project ke liye
      // physical smart meter connected nahi hai

      const previousReading = 1000;

      const currentReading = 1100;


      // ==========================================
      // CALCULATE ELECTRICITY UNITS
      // ==========================================

      const units =

        currentReading -

        previousReading;


      // ==========================================
      // DUE DATE
      // ==========================================

      const dueDate =

        new Date(

          currentDate.getTime() +

          15 *

          24 *

          60 *

          60 *

          1000

        ).toLocaleDateString(

          "en-IN"

        );


      // ==========================================
      // CREATE BILL
      // ==========================================

      const createBillResponse =

        await fetch(

          "http://localhost:5000/api/bills/create",

          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json"

            },

            body: JSON.stringify({

              consumerNumber:
                consumerNumber,

              billNumber:
                billNumber,

              month:
                month,

              units:
                units,

              dueDate:
                dueDate

            })

          }

        );


      // ==========================================
      // GET BILL RESPONSE
      // ==========================================

      const createBillData =

        await createBillResponse.json();


      // ==========================================
      // CHECK BILL CREATION
      // ==========================================

      if (!createBillResponse.ok) {

        throw new Error(

          createBillData.message ||

          "Bill generation failed"

        );

      }


      // ==========================================
      // SUCCESS MESSAGE
      // ==========================================

      alert(

        "OTP Verified Successfully!\n\n" +

        "Electricity Bill Generated Successfully!\n\n" +

        "Previous Reading: " +

        previousReading +

        "\nCurrent Reading: " +

        currentReading +

        "\nUnits Used: " +

        units +

        " kWh" +

        "\nBill Amount: ₹" +

        createBillData.bill.amount

      );


      // ==========================================
      // REMOVE OTP
      // ==========================================

      localStorage.removeItem(
        "demoOTP"
      );


      // ==========================================
      // GO TO DASHBOARD
      // ==========================================

      navigate("/dashboard");


    } catch (error) {

      console.error(

        "OTP / BILL ERROR:",

        error

      );


      alert(

        "OTP verified, but bill generation failed.\n\n" +

        error.message

      );


    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // RESEND OTP
  // ==========================================

  const handleResendOTP = () => {

    const newOtp =

      Math.floor(

        100000 +

        Math.random() *

        900000

      ).toString();


    localStorage.setItem(

      "demoOTP",

      newOtp

    );


    setGeneratedOtp(

      newOtp

    );


    setOtp("");


    setCountdown(

      30

    );


    alert(

      "New Demo OTP : " +

      newOtp

    );

  };


  // ==========================================
  // PAGE UI
  // ==========================================

  return (

    <div className="otp-page">

      <div className="otp-card">


        {/* LOGO */}

        <div className="otp-logo">

          <div className="logo-circle">

            <FaBolt />

          </div>

        </div>


        {/* TITLE */}

        <h1>

          OTP Verification

        </h1>


        <p>

          Enter the OTP sent to your registered
          mobile number.

        </p>


        {/* DEMO OTP */}

        <div

          style={{

            background:
              "#e8fff1",

            color:
              "#0b8f3f",

            padding:
              "15px",

            borderRadius:
              "12px",

            marginBottom:
              "25px",

            fontWeight:
              "600"

          }}

        >

          ✅ OTP Sent Successfully

          <br />

          Demo OTP :

          <strong>

            {" "}

            {generatedOtp}

          </strong>

        </div>


        {/* OTP INPUT */}

        <input

          type="text"

          placeholder="Enter OTP"

          maxLength="6"

          value={otp}

          onChange={(e) =>

            setOtp(

              e.target.value

            )

          }

        />


        {/* VERIFY BUTTON */}

        <button

          onClick={handleVerifyOTP}

          disabled={loading}

        >

          {loading

            ? "Generating Bill..."

            : "Verify OTP"

          }

        </button>


        {/* RESEND OTP */}

        <div className="otp-footer">

          {countdown > 0 ? (

            <span>

              Resend OTP in{" "}

              {countdown}s

            </span>

          ) : (

            <button

              className="resend-btn"

              onClick={handleResendOTP}

            >

              Resend OTP

            </button>

          )}

        </div>


        {/* BACK TO LOGIN */}

        <Link

          to="/login"

          className="back-btn"

        >

          <FaArrowLeft />

          Back to Login

        </Link>


      </div>

    </div>

  );

}


export default Otp;