import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBolt,
  FaArrowLeft,
  FaFileInvoiceDollar
} from "react-icons/fa";

import "../styles/bills.css";

function Bills() {

  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET LOGGED-IN CONSUMER NUMBER
  // ==========================================

  const consumerNumber =
    localStorage.getItem("consumerNumber");


  // ==========================================
  // GET BILLS FROM BACKEND
  // ==========================================

  useEffect(() => {

    if (!consumerNumber) {

      navigate("/login");

      return;

    }


    fetch(
      `http://localhost:5000/api/bills/${consumerNumber}`
    )

      .then((response) => {

        if (!response.ok) {

          throw new Error(
            "Bills could not be loaded"
          );

        }

        return response.json();

      })

      .then((data) => {

        setBills(data.bills || []);

        setLoading(false);

      })

      .catch((error) => {

        console.log(
          "Bills Error:",
          error
        );

        setError(
          "Unable to load bills. Please try again."
        );

        setLoading(false);

      });

  }, [consumerNumber, navigate]);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="bills-page">

        <div className="bills-loading">

          <FaBolt />

          <h2>Loading Your Bills...</h2>

          <p>Please wait...</p>

        </div>

      </div>

    );

  }


  return (

    <div className="bills-page">


      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="bills-header">


        <div className="bills-title">


          <div className="bills-icon">

            <FaFileInvoiceDollar />

          </div>


          <div>

            <h1>My Electricity Bills</h1>

            <p>

              View your electricity bills and payment status.

            </p>

          </div>


        </div>


        <Link
          to="/dashboard"
          className="back-dashboard"
        >

          <FaArrowLeft />

          Back to Dashboard

        </Link>


      </div>


      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (

        <div className="bills-error">

          {error}

        </div>

      )}


      {/* ==========================================
          NO BILLS
      ========================================== */}

      {!error && bills.length === 0 && (

        <div className="no-bills">

          <FaFileInvoiceDollar />

          <h2>No Bills Available</h2>

          <p>

            Your electricity bills will appear here
            when a bill is generated.

          </p>

        </div>

      )}


      {/* ==========================================
          BILL CARDS
      ========================================== */}

      {bills.length > 0 && (

        <div className="bills-container">


          {bills.map((bill) => (

            <div
              className="bill-card"
              key={bill._id}
            >


              {/* Bill Header */}

              <div className="bill-card-header">


                <div>

                  <h2>

                    {bill.month}

                  </h2>

                  <p>

                    Bill No: {bill.billNumber}

                  </p>

                </div>


                <span
                  className={
                    bill.status === "Paid"
                      ? "status paid"
                      : "status pending"
                  }
                >

                  {bill.status}

                </span>


              </div>


              {/* Bill Details */}

              <div className="bill-details">


                <div>

                  <span>Consumer Number</span>

                  <strong>

                    {bill.consumerNumber}

                  </strong>

                </div>


                <div>

                  <span>Units Used</span>

                  <strong>

                    {bill.units} Units

                  </strong>

                </div>


                <div>

                  <span>Bill Amount</span>

                  <strong>

                    ₹{bill.amount}

                  </strong>

                </div>


                <div>

                  <span>Due Date</span>

                  <strong>

                    {bill.dueDate}

                  </strong>

                </div>


              </div>


              {/* Pay Button */}

              {bill.status !== "Paid" && (

                <button
                  className="pay-bill-btn"
                  onClick={() =>
                    navigate("/paybill", {
                      state: {
                        bill: bill
                      }
                    })
                  }
                >

                  Pay This Bill

                </button>

              )}


              {bill.status === "Paid" && (

                <div className="paid-message">

                  ✓ Payment Completed

                </div>

              )}


            </div>

          ))}


        </div>

      )}


    </div>

  );

}

export default Bills;