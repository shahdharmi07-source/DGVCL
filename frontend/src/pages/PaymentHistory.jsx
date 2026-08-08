import React, { useState } from "react";

import {
  FaHistory,
  FaArrowLeft,
  FaCheckCircle,
  FaReceipt,
  FaCreditCard,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaSearch,
  FaDownload,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import "../styles/paymenthistory.css";


function PaymentHistory() {

  const navigate = useNavigate();

  /* =========================
     PAYMENT DATA
  ========================== */

  const [payments] = useState([
    {
      id: 1,
      billNo: "DGVCL-BILL-1001",
      transactionId: "TXN789456123",
      amount: "$45.00",
      date: "15 July 2026",
      method: "UPI",
      status: "Paid",
    },

    {
      id: 2,
      billNo: "DGVCL-BILL-1002",
      transactionId: "TXN789456124",
      amount: "$52.00",
      date: "15 June 2026",
      method: "Debit Card",
      status: "Paid",
    },

    {
      id: 3,
      billNo: "DGVCL-BILL-1003",
      transactionId: "TXN789456125",
      amount: "$48.00",
      date: "15 May 2026",
      method: "Credit Card",
      status: "Paid",
    },

    {
      id: 4,
      billNo: "DGVCL-BILL-1004",
      transactionId: "TXN789456126",
      amount: "$41.00",
      date: "15 April 2026",
      method: "Net Banking",
      status: "Paid",
    },

    {
      id: 5,
      billNo: "DGVCL-BILL-1005",
      transactionId: "TXN789456127",
      amount: "$55.00",
      date: "15 March 2026",
      method: "UPI",
      status: "Paid",
    },
  ]);


  /* =========================
     SEARCH
  ========================== */

  const [search, setSearch] = useState("");


  const filteredPayments = payments.filter((payment) => {

    const searchText = search.toLowerCase();

    return (
      payment.billNo.toLowerCase().includes(searchText) ||
      payment.transactionId.toLowerCase().includes(searchText) ||
      payment.method.toLowerCase().includes(searchText) ||
      payment.date.toLowerCase().includes(searchText)
    );

  });


  /* =========================
     DOWNLOAD RECEIPT
  ========================== */

  const handleDownload = (payment) => {

    alert(
      `Receipt download started for ${payment.transactionId}`
    );

  };


  return (

    <div className="payment-history-page">


      {/* =========================
          HEADER
      ========================== */}

      <div className="payment-history-header">

        <button
          className="payment-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>


        <div className="payment-header-content">

          <div className="payment-header-icon">
            <FaHistory />
          </div>

          <div>

            <h1>Payment History</h1>

            <p>
              View your previous electricity bill payments
              and transaction details
            </p>

          </div>

        </div>

      </div>


      {/* =========================
          MAIN CONTAINER
      ========================== */}

      <div className="payment-history-container">


        {/* =========================
            SUMMARY CARDS
        ========================== */}

        <div className="payment-summary">


          <div className="summary-card">

            <div className="summary-icon">
              <FaReceipt />
            </div>

            <div>

              <span>Total Payments</span>

              <h2>{payments.length}</h2>

            </div>

          </div>


          <div className="summary-card">

            <div className="summary-icon">
              <FaCheckCircle />
            </div>

            <div>

              <span>Successful Payments</span>

              <h2>
                {
                  payments.filter(
                    (payment) =>
                      payment.status === "Paid"
                  ).length
                }
              </h2>

            </div>

          </div>


          <div className="summary-card">

            <div className="summary-icon">
              <FaCreditCard />
            </div>

            <div>

              <span>Last Payment</span>

              <h2>
                {payments[0].amount}
              </h2>

            </div>

          </div>

        </div>


        {/* =========================
            PAYMENT HISTORY CARD
        ========================== */}

        <div className="payment-history-card">


          {/* CARD HEADER */}

          <div className="history-card-header">

            <div>

              <h2>
                <FaFileInvoiceDollar />
                Recent Transactions
              </h2>

              <p>
                Your recent electricity bill payment records
              </p>

            </div>


            {/* SEARCH */}

            <div className="payment-search">

              <FaSearch />

              <input
                type="text"
                placeholder="Search payment..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>


          {/* =========================
              PAYMENT TABLE
          ========================== */}

          <div className="payment-table-wrapper">

            <table className="payment-table">

              <thead>

                <tr>

                  <th>Bill Number</th>

                  <th>Transaction ID</th>

                  <th>Payment Date</th>

                  <th>Payment Method</th>

                  <th>Amount</th>

                  <th>Status</th>

                  <th>Receipt</th>

                </tr>

              </thead>


              <tbody>

                {filteredPayments.length > 0 ? (

                  filteredPayments.map((payment) => (

                    <tr key={payment.id}>


                      {/* BILL NUMBER */}

                      <td>

                        <div className="bill-number">

                          <FaFileInvoiceDollar />

                          <span>
                            {payment.billNo}
                          </span>

                        </div>

                      </td>


                      {/* TRANSACTION ID */}

                      <td>

                        <span className="transaction-id">

                          {payment.transactionId}

                        </span>

                      </td>


                      {/* DATE */}

                      <td>

                        <div className="payment-date">

                          <FaCalendarAlt />

                          {payment.date}

                        </div>

                      </td>


                      {/* METHOD */}

                      <td>

                        <span className="payment-method">

                          <FaCreditCard />

                          {payment.method}

                        </span>

                      </td>


                      {/* AMOUNT */}

                      <td>

                        <strong className="payment-amount">

                          {payment.amount}

                        </strong>

                      </td>


                      {/* STATUS */}

                      <td>

                        <span className="payment-status">

                          <FaCheckCircle />

                          {payment.status}

                        </span>

                      </td>


                      {/* DOWNLOAD */}

                      <td>

                        <button
                          className="download-receipt-btn"
                          onClick={() =>
                            handleDownload(payment)
                          }
                        >

                          <FaDownload />

                          Receipt

                        </button>

                      </td>


                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="no-payment"
                    >

                      <FaHistory />

                      <h3>
                        No Payment Found
                      </h3>

                      <p>
                        Try searching with a different
                        bill number or transaction ID.
                      </p>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>


        </div>


        {/* =========================
            FOOTER INFO
        ========================== */}

        <div className="payment-info">

          <FaCheckCircle />

          <div>

            <h3>
              All payments are secure
            </h3>

            <p>
              Your payment transactions are securely
              recorded in the DGVCL Consumer Portal.
            </p>

          </div>

        </div>


      </div>

    </div>

  );

}


export default PaymentHistory;