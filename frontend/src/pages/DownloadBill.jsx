import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBolt,
  FaDownload,
  FaArrowLeft,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaUser,
  FaHashtag,
  FaCalendarAlt,
  FaTachometerAlt
} from "react-icons/fa";

import jsPDF from "jspdf";

import "../styles/downloadbill.css";

function DownloadBill() {

  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [consumer, setConsumer] = useState(null);

  const [bill, setBill] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // GET USER + BILL DATA
  // =====================================================

  useEffect(() => {

    const savedUser =
      localStorage.getItem("loggedInUser");


    // User login nahi hai
    if (!savedUser) {

      navigate("/login");

      return;

    }


    try {

      // Logged in user data
      const userData =
        JSON.parse(savedUser);


      setConsumer(userData);


      // Consumer Number
      const consumerNumber =
        userData.consumerNumber;


      // Consumer number available nahi hai
      if (!consumerNumber) {

        setError(
          "Consumer number not found."
        );

        setLoading(false);

        return;

      }


      // =====================================================
      // FETCH BILLS FROM BACKEND
      // =====================================================

      fetch(
        `http://localhost:5000/api/bills/${consumerNumber}`
      )

        .then((response) => {

          if (!response.ok) {

            throw new Error(
              "Unable to fetch bills."
            );

          }

          return response.json();

        })

        .then((data) => {

          console.log(
            "Bills received:",
            data
          );


          // Backend se bills array
          const bills =
            data.bills || [];


          if (bills.length > 0) {

            // Latest bill
            setBill(bills[0]);

          } else {

            setBill(null);

            setError(
              "No bill available for this consumer."
            );

          }

        })

        .catch((err) => {

          console.error(
            "Bill Fetch Error:",
            err
          );


          setError(
            "Unable to load bill details."
          );

        })

        .finally(() => {

          setLoading(false);

        });

    } catch (err) {

      console.error(
        "User Data Error:",
        err
      );


      localStorage.removeItem(
        "loggedInUser"
      );


      navigate("/login");

    }

  }, [navigate]);


  // =====================================================
  // DOWNLOAD BILL PDF
  // =====================================================

  const handleDownload = () => {

    if (!bill || !consumer) {

      alert(
        "Bill data is not available."
      );

      return;

    }


    const doc = new jsPDF();


    // =====================================================
    // HEADER
    // =====================================================

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(22);

    doc.text(
      "DGVCL",
      20,
      25
    );


    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(11);

    doc.text(
      "Smart Electricity Consumer Portal",
      20,
      33
    );


    doc.line(
      20,
      40,
      190,
      40
    );


    // =====================================================
    // BILL TITLE
    // =====================================================

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(18);

    doc.text(
      "ELECTRICITY BILL",
      20,
      55
    );


    // =====================================================
    // CONSUMER INFORMATION
    // =====================================================

    doc.setFontSize(13);

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      "Consumer Information",
      20,
      70
    );


    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(11);

    doc.text(
      `Consumer Name : ${consumer.name || "N/A"}`,
      20,
      82
    );

    doc.text(
      `Consumer Number : ${consumer.consumerNumber || "N/A"}`,
      20,
      92
    );

    doc.text(
      `Meter Number : ${consumer.meterNumber || "N/A"}`,
      20,
      102
    );


    // =====================================================
    // BILL INFORMATION
    // =====================================================

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(13);

    doc.text(
      "Bill Information",
      20,
      120
    );


    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(11);

    doc.text(
      `Bill Number : ${bill.billNumber || "N/A"}`,
      20,
      132
    );

    doc.text(
      `Bill Month : ${bill.month || "N/A"}`,
      20,
      142
    );

    doc.text(
      `Bill Date : ${
        bill.createdAt
          ? new Date(bill.createdAt).toLocaleDateString()
          : "N/A"
      }`,
      20,
      152
    );

    doc.text(
      `Due Date : ${bill.dueDate || "N/A"}`,
      20,
      162
    );


    // =====================================================
    // METER READING
    // =====================================================

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(13);

    doc.text(
      "Meter Reading Details",
      20,
      180
    );


    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(11);

    doc.text(
      `Units Consumed : ${bill.units || 0} kWh`,
      20,
      192
    );


    // =====================================================
    // TOTAL AMOUNT
    // =====================================================

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(14);

    doc.text(
      "Total Bill Amount",
      20,
      215
    );


    doc.setFontSize(20);

    doc.text(
      `Rs. ${bill.amount || 0}`,
      20,
      228
    );


    // =====================================================
    // PAYMENT STATUS
    // =====================================================

    doc.setFontSize(11);

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      `Payment Status : ${bill.status || "Pending"}`,
      20,
      242
    );


    // =====================================================
    // FOOTER
    // =====================================================

    doc.line(
      20,
      255,
      190,
      255
    );


    doc.setFontSize(10);

    doc.text(
      "This is a computer-generated electricity bill.",
      20,
      270
    );

    doc.text(
      "Thank you for using DGVCL Smart Consumer Portal.",
      20,
      278
    );


    // =====================================================
    // SAVE PDF
    // =====================================================

    doc.save(
      `DGVCL_Bill_${bill.month || "Bill"}.pdf`
    );

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="loading-screen">

        <FaBolt />

        <h2>
          Loading Bill...
        </h2>

        <p>
          Please wait while we fetch your bill details.
        </p>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error || !bill) {

    return (

      <div className="loading-screen">

        <FaFileInvoiceDollar />

        <h2>
          Bill Not Available
        </h2>

        <p>
          {error || "No bill found."}
        </p>


        <button
          className="back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
        >

          <FaArrowLeft />

          Back to Dashboard

        </button>

      </div>

    );

  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div className="download-bill-page">

      <div className="bill-container">


        {/* =====================================
            HEADER
        ===================================== */}

        <div className="bill-header">

          <div className="bill-logo">

            <FaBolt />

          </div>


          <div>

            <h1>
              DGVCL
            </h1>

            <p>
              Smart Electricity Consumer Portal
            </p>

          </div>

        </div>


        {/* =====================================
            BILL TITLE
        ===================================== */}

        <div className="bill-title">

          <div>

            <h2>

              <FaFileInvoiceDollar />

              Electricity Bill

            </h2>

            <p>
              View and download your latest electricity bill.
            </p>

          </div>


          <div
            className={
              bill.status === "Paid"
                ? "bill-status paid-status"
                : "bill-status"
            }
          >

            <FaCheckCircle />

            {bill.status || "Pending"}

          </div>

        </div>


        {/* =====================================
            CONSUMER INFORMATION
        ===================================== */}

        <div className="bill-section">

          <h3>
            Consumer Information
          </h3>


          <div className="bill-grid">


            <div className="bill-info">

              <FaUser />

              <div>

                <span>
                  Consumer Name
                </span>

                <strong>
                  {consumer.name || "N/A"}
                </strong>

              </div>

            </div>


            <div className="bill-info">

              <FaHashtag />

              <div>

                <span>
                  Consumer Number
                </span>

                <strong>
                  {consumer.consumerNumber || "N/A"}
                </strong>

              </div>

            </div>


            <div className="bill-info">

              <FaTachometerAlt />

              <div>

                <span>
                  Meter Number
                </span>

                <strong>
                  {consumer.meterNumber || "N/A"}
                </strong>

              </div>

            </div>


            <div className="bill-info">

              <FaFileInvoiceDollar />

              <div>

                <span>
                  Bill Number
                </span>

                <strong>
                  {bill.billNumber || "N/A"}
                </strong>

              </div>

            </div>


          </div>

        </div>


        {/* =====================================
            BILL INFORMATION
        ===================================== */}

        <div className="bill-section">

          <h3>
            Bill Information
          </h3>


          <div className="bill-grid">


            <div className="bill-info">

              <FaCalendarAlt />

              <div>

                <span>
                  Bill Month
                </span>

                <strong>
                  {bill.month}
                </strong>

              </div>

            </div>


            <div className="bill-info">

              <FaCalendarAlt />

              <div>

                <span>
                  Bill Date
                </span>

                <strong>

                  {bill.createdAt
                    ? new Date(
                        bill.createdAt
                      ).toLocaleDateString()
                    : "N/A"
                  }

                </strong>

              </div>

            </div>


            <div className="bill-info">

              <FaCalendarAlt />

              <div>

                <span>
                  Due Date
                </span>

                <strong>
                  {bill.dueDate}
                </strong>

              </div>

            </div>


            <div className="bill-info">

              <FaCheckCircle />

              <div>

                <span>
                  Payment Status
                </span>

                <strong
                  className={
                    bill.status === "Paid"
                      ? "paid-status-text"
                      : "pending-status"
                  }
                >

                  {bill.status || "Pending"}

                </strong>

              </div>

            </div>


          </div>

        </div>


        {/* =====================================
            METER READING
        ===================================== */}

        <div className="reading-section">

          <h3>
            Meter Reading Details
          </h3>


          <div className="reading-grid">


            <div>

              <span>
                Units Consumed
              </span>

              <strong>
                {bill.units} kWh
              </strong>

            </div>


            <div>

              <span>
                Bill Amount
              </span>

              <strong>
                ₹{bill.amount}
              </strong>

            </div>


            <div>

              <span>
                Bill Status
              </span>

              <strong>
                {bill.status || "Pending"}
              </strong>

            </div>


          </div>

        </div>


        {/* =====================================
            TOTAL BILL
        ===================================== */}

        <div className="bill-total">

          <div>

            <span>
              Total Bill Amount
            </span>

            <small>
              {bill.status === "Paid"
                ? "Bill payment completed"
                : "Pay before due date"
              }
            </small>

          </div>


          <strong>
            ₹{bill.amount}
          </strong>

        </div>


        {/* =====================================
            BUTTONS
        ===================================== */}

        <div className="bill-buttons">


          <button
            type="button"
            className="download-btn"
            onClick={handleDownload}
          >

            <FaDownload />

            Download Bill PDF

          </button>


          <button
            type="button"
            className="back-btn"
            onClick={() =>
              navigate("/dashboard")
            }
          >

            <FaArrowLeft />

            Back to Dashboard

          </button>


        </div>


        {/* =====================================
            FOOTER
        ===================================== */}

        <div className="bill-footer">

          <FaBolt />

          <p>
            DGVCL Smart Electricity Consumer Portal
          </p>

          <span>
            This is a computer-generated bill.
          </span>

        </div>


      </div>

    </div>

  );

}


export default DownloadBill;