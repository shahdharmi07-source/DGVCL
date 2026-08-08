import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  FaBolt,
  FaCheckCircle,
  FaDownload,
  FaArrowLeft,
  FaReceipt
} from "react-icons/fa";

import "../styles/receipt.css";


function Receipt() {

  const navigate = useNavigate();

  const location = useLocation();


  // ==========================================
  // GET DATA FROM PAYBILL PAGE
  // ==========================================

  const paymentData =
    location.state?.payment;

  const bill =
    location.state?.bill;

  const user =
    location.state?.user;


  // ==========================================
  // NO RECEIPT DATA
  // ==========================================

  if (!paymentData || !bill || !user) {

    return (

      <div className="receipt-page">

        <div className="empty-receipt-card">

          <div className="empty-receipt-icon">

            <FaReceipt />

          </div>


          <h2>
            No Receipt Available
          </h2>


          <p>

            Please complete your electricity
            bill payment to view the receipt.

          </p>


          <button

            className="receipt-back-btn"

            onClick={() =>
              navigate("/dashboard")
            }

          >

            <FaArrowLeft />

            Back to Dashboard

          </button>

        </div>

      </div>

    );

  }


  // ==========================================
  // DOWNLOAD / PRINT RECEIPT
  // ==========================================

  const handleDownloadReceipt = () => {

    window.print();

  };


  return (

    <div className="receipt-page">

      <div className="receipt-wrapper">


        {/* =================================
            HEADER
        ================================= */}

        <div className="receipt-top-header">

          <div className="dgvcl-logo">

            <FaBolt />

          </div>


          <div>

            <h1>
              DGPS
            </h1>

            <p>
              Smart Electricity Consumer Portal
            </p>

          </div>

        </div>


        {/* =================================
            SUCCESS MESSAGE
        ================================= */}

        <div className="payment-success">

          <FaCheckCircle />


          <div>

            <h2>
              Payment Successful!
            </h2>


            <p>

              Your electricity bill payment has
              been successfully completed.

            </p>

          </div>

        </div>


        {/* =================================
            RECEIPT TITLE
        ================================= */}

        <div className="receipt-title">

          <h2>
            Payment Receipt
          </h2>


          <span>
            Transaction Details
          </span>

        </div>


        {/* =================================
            CONSUMER INFORMATION
        ================================= */}

        <div className="receipt-section">

          <h3>
            Consumer Information
          </h3>


          <div className="receipt-grid">


            {/* Consumer Name */}

            <div className="receipt-item">

              <span>
                Consumer Name
              </span>


              <strong>

                {user.name || "N/A"}

              </strong>

            </div>


            {/* Consumer Number */}

            <div className="receipt-item">

              <span>
                Consumer Number
              </span>


              <strong>

                {user.consumerNumber || "N/A"}

              </strong>

            </div>


            {/* Meter Number */}

            <div className="receipt-item">

              <span>
                Meter Number
              </span>


              <strong>

                {user.meterNumber || "N/A"}

              </strong>

            </div>


            {/* Mobile */}

            <div className="receipt-item">

              <span>
                Mobile Number
              </span>


              <strong>

                {user.mobile || "N/A"}

              </strong>

            </div>


            {/* Bill Number */}

            <div className="receipt-item">

              <span>
                Bill Number
              </span>


              <strong>

                {bill.billNumber || "N/A"}

              </strong>

            </div>


            {/* Bill Month */}

            <div className="receipt-item">

              <span>
                Bill Month
              </span>


              <strong>

                {bill.month || "N/A"}

              </strong>

            </div>

          </div>

        </div>


        {/* =================================
            PAYMENT INFORMATION
        ================================= */}

        <div className="receipt-section">

          <h3>
            Payment Information
          </h3>


          <div className="receipt-grid">


            {/* Payment Date */}

            <div className="receipt-item">

              <span>
                Payment Date
              </span>


              <strong>

                {paymentData.paymentDate

                  ? new Date(
                      paymentData.paymentDate
                    ).toLocaleString("en-IN")

                  : new Date().toLocaleString("en-IN")

                }

              </strong>

            </div>


            {/* Transaction ID */}

            <div className="receipt-item">

              <span>
                Transaction ID
              </span>


              <strong>

                {paymentData.transactionId || "N/A"}

              </strong>

            </div>


            {/* Payment Method */}

            <div className="receipt-item">

              <span>
                Payment Method
              </span>


              <strong>

                {paymentData.paymentMethod || "N/A"}

              </strong>

            </div>


            {/* Payment Status */}

            <div className="receipt-item">

              <span>
                Payment Status
              </span>


              <strong>

                {paymentData.status || "Success"}

              </strong>

            </div>

          </div>

        </div>


        {/* =================================
            BILL DETAILS
        ================================= */}

        <div className="receipt-section">

          <h3>
            Bill Details
          </h3>


          <div className="receipt-grid">


            {/* Units */}

            <div className="receipt-item">

              <span>
                Units Consumed
              </span>


              <strong>

                {bill.units} kWh

              </strong>

            </div>


            {/* Due Date */}

            <div className="receipt-item">

              <span>
                Original Due Date
              </span>


              <strong>

                {bill.dueDate || "N/A"}

              </strong>

            </div>


            {/* Bill Status */}

            <div className="receipt-item">

              <span>
                Bill Status
              </span>


              <strong>

                Paid

              </strong>

            </div>

          </div>

        </div>


        {/* =================================
            TOTAL AMOUNT
        ================================= */}

        <div className="total-payment">

          <span>
            Total Amount Paid
          </span>


          <strong>

            ₹{paymentData.amount || bill.amount}

          </strong>

        </div>


        {/* =================================
            BUTTONS
        ================================= */}

        <div className="receipt-buttons">


          <button

            className="download-receipt"

            onClick={
              handleDownloadReceipt
            }

          >

            <FaDownload />

            Download Receipt

          </button>


          <button

            className="dashboard-receipt-btn"

            onClick={() =>
              navigate("/dashboard")
            }

          >

            <FaArrowLeft />

            Back to Dashboard

          </button>

        </div>


        {/* =================================
            FOOTER
        ================================= */}

        <div className="receipt-footer">

          <FaBolt />


          <p>

            Thank you for using DGPS Smart
            Electricity Consumer Portal.

          </p>


          <span>

            This is a computer-generated receipt.

          </span>

        </div>


      </div>

    </div>

  );

}


export default Receipt;