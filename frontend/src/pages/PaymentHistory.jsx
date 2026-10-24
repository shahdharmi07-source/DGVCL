import React, { useEffect, useState } from "react";

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
  FaExclamationCircle,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import "../styles/paymenthistory.css";

function PaymentHistory() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH PAYMENT HISTORY
  // ==========================================

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError("");

      // Get logged-in consumer number
      const consumerNumber =
        localStorage.getItem("consumerNumber");

      if (!consumerNumber) {
        setError(
          "Consumer number not found. Please login again."
        );

        setLoading(false);
        return;
      }

      console.log(
        "Fetching payment history for:",
        consumerNumber
      );

      // Backend API
      const response = await fetch(
        `http://localhost:5000/api/payments/${consumerNumber}`
      );

      const data = await response.json();

      console.log("Payment History Response:", data);

      if (response.ok) {
        setPayments(data.payments || []);
      } else {
        setError(
          data.message ||
            "Unable to fetch payment history."
        );
      }
    } catch (error) {
      console.error(
        "PAYMENT HISTORY ERROR:",
        error
      );

      setError(
        "Backend server is not connected."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredPayments = payments.filter(
    (payment) => {
      const searchText =
        search.toLowerCase();

      return (
        (payment.billNumber || "")
          .toLowerCase()
          .includes(searchText) ||

        (payment.transactionId || "")
          .toLowerCase()
          .includes(searchText) ||

        (payment.paymentMethod || "")
          .toLowerCase()
          .includes(searchText) ||

        (payment.billMonth || "")
          .toLowerCase()
          .includes(searchText) ||

        (payment.status || "")
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

  // ==========================================
  // PAYMENT STATUS
  // ==========================================

  const isPaymentSuccessful = (payment) => {
    return (
      payment.status === "Success" ||
      payment.status === "Paid" ||
      payment.status === "Successful"
    );
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const paymentDate = new Date(date);

    if (isNaN(paymentDate.getTime())) {
      return date;
    }

    return paymentDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // FORMAT AMOUNT
  // ==========================================

  const formatAmount = (amount) => {
    const numericAmount = Number(amount);

    if (isNaN(numericAmount)) {
      return `₹${amount}`;
    }

    return `₹${numericAmount.toFixed(2)}`;
  };

  // ==========================================
  // DOWNLOAD RECEIPT
  // ==========================================

  const handleDownload = (payment) => {
    alert(
      `Receipt download started for ${payment.transactionId}`
    );
  };

  // ==========================================
  // SUCCESSFUL PAYMENTS
  // ==========================================

  const successfulPayments =
    payments.filter((payment) =>
      isPaymentSuccessful(payment)
    );

  // ==========================================
  // LAST PAYMENT
  // ==========================================

  const lastPayment =
    payments.length > 0
      ? payments[0]
      : null;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="payment-history-page">

      {/* HEADER */}

      <div className="payment-history-header">

        <button
          className="payment-back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
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
              View your previous electricity
              bill payments and transaction
              details
            </p>
          </div>

        </div>

      </div>

      {/* MAIN */}

      <div className="payment-history-container">

        {/* ERROR */}

        {error && (
          <div
            className="payment-error"
            style={{
              padding: "14px 18px",
              marginBottom: "20px",
              borderRadius: "12px",
              background: "#fff1f0",
              border: "1px solid #ffd2ce",
              color: "#b42318",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <FaExclamationCircle />
            {error}
          </div>
        )}

        {/* SUMMARY */}

        <div className="payment-summary">

          {/* TOTAL */}

          <div className="summary-card">

            <div className="summary-icon">
              <FaReceipt />
            </div>

            <div>
              <span>Total Payments</span>

              <h2>
                {loading
                  ? "..."
                  : payments.length}
              </h2>
            </div>

          </div>

          {/* SUCCESSFUL */}

          <div className="summary-card">

            <div className="summary-icon">
              <FaCheckCircle />
            </div>

            <div>
              <span>
                Successful Payments
              </span>

              <h2>
                {loading
                  ? "..."
                  : successfulPayments.length}
              </h2>
            </div>

          </div>

          {/* LAST PAYMENT */}

          <div className="summary-card">

            <div className="summary-icon">
              <FaCreditCard />
            </div>

            <div>
              <span>Last Payment</span>

              <h2>
                {loading
                  ? "..."
                  : lastPayment
                  ? formatAmount(
                      lastPayment.amount
                    )
                  : "₹0.00"}
              </h2>
            </div>

          </div>

        </div>

        {/* PAYMENT CARD */}

        <div className="payment-history-card">

          <div className="history-card-header">

            <div>
              <h2>
                <FaFileInvoiceDollar />
                Recent Transactions
              </h2>

              <p>
                Your recent electricity bill
                payment records
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
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="no-payment">

              <FaHistory />

              <h3>
                Loading Payment History...
              </h3>

              <p>
                Please wait while we fetch
                your payment records.
              </p>

            </div>

          ) : (

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

                    filteredPayments.map(
                      (payment) => (

                        <tr
                          key={
                            payment._id ||
                            payment.transactionId
                          }
                        >

                          {/* BILL */}

                          <td>
                            <div className="bill-number">

                              <FaFileInvoiceDollar />

                              <span>
                                {
                                  payment.billNumber ||
                                  "N/A"
                                }
                              </span>

                            </div>
                          </td>

                          {/* TRANSACTION */}

                          <td>
                            <span className="transaction-id">
                              {
                                payment.transactionId ||
                                "N/A"
                              }
                            </span>
                          </td>

                          {/* DATE */}

                          <td>
                            <div className="payment-date">

                              <FaCalendarAlt />

                              {
                                formatDate(
                                  payment.createdAt
                                )
                              }

                            </div>
                          </td>

                          {/* METHOD */}

                          <td>
                            <span className="payment-method">

                              <FaCreditCard />

                              {
                                payment.paymentMethod ||
                                "N/A"
                              }

                            </span>
                          </td>

                          {/* AMOUNT */}

                          <td>
                            <strong className="payment-amount">

                              {
                                formatAmount(
                                  payment.amount
                                )
                              }

                            </strong>
                          </td>

                          {/* STATUS */}

                          <td>
                            <span className="payment-status">

                              <FaCheckCircle />

                              {
                                isPaymentSuccessful(
                                  payment
                                )
                                  ? "Paid"
                                  : payment.status ||
                                    "Unknown"
                              }

                            </span>
                          </td>

                          {/* RECEIPT */}

                          <td>

                            <button
                              className="download-receipt-btn"
                              onClick={() =>
                                handleDownload(
                                  payment
                                )
                              }
                            >

                              <FaDownload />
                              Receipt

                            </button>

                          </td>

                        </tr>

                      )
                    )

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
                          {search
                            ? "Try searching with a different bill number or transaction ID."
                            : "You have not made any electricity bill payments yet."}
                        </p>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* FOOTER */}

        <div className="payment-info">

          <FaCheckCircle />

          <div>

            <h3>
              All payments are secure
            </h3>

            <p>
              Your payment transactions are
              securely recorded in the
              DGVCL Consumer Portal.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default PaymentHistory;