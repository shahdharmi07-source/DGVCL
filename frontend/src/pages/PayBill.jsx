import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBolt,
  FaUser,
  FaIdCard,
  FaTachometerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaMobileAlt,
  FaCreditCard,
  FaUniversity,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";

import "../styles/paybill.css";

function PayBill() {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [bill, setBill] = useState(null);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("");

  const [upiId, setUpiId] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [paying, setPaying] = useState(false);

  // ==========================================
  // LOAD USER AND BILL
  // ==========================================

  useEffect(() => {
    const loggedInUser =
      localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    try {
      const userData =
        JSON.parse(loggedInUser);

      setUser(userData);

      const consumerNumber =
        userData.consumerNumber;

      if (!consumerNumber) {
        alert("Consumer number not found.");
        navigate("/login");
        return;
      }

      // ==========================================
      // GET USER BILLS
      // ==========================================

      fetch(
        `http://localhost:5000/api/bills/${consumerNumber}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Unable to fetch bills"
            );
          }

          return response.json();
        })
        .then((data) => {
          const bills =
            data.bills || [];

          // Find latest pending bill
          const pendingBill =
            bills.find(
              (item) =>
                item.status === "Pending"
            );

          if (!pendingBill) {
            alert(
              "No pending bill found."
            );

            navigate("/dashboard");
            return;
          }

          setBill(pendingBill);
        })
        .catch((error) => {
          console.error(
            "Bill Fetch Error:",
            error
          );

          alert(
            "Unable to load bill. Please try again."
          );
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error(
        "User Data Error:",
        error
      );

      alert(
        "Invalid login information. Please login again."
      );

      navigate("/login");
    }
  }, [navigate]);

  // ==========================================
  // PAYMENT METHOD
  // ==========================================

  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);

    setUpiId("");

    setCardNumber("");
    setCardHolder("");
    setExpiryDate("");
    setCvv("");

    setBankName("");
    setAccountNumber("");
    setIfscCode("");
  };

  // ==========================================
  // PAYMENT
  // ==========================================

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert(
        "Please select a payment method."
      );
      return;
    }

    // ==========================================
    // UPI VALIDATION
    // ==========================================

    if (
      paymentMethod === "UPI" &&
      upiId.trim() === ""
    ) {
      alert(
        "Please enter your UPI ID."
      );
      return;
    }

    // ==========================================
    // CARD VALIDATION
    // ==========================================

    if (paymentMethod === "CARD") {
      if (
        cardNumber.trim() === "" ||
        cardHolder.trim() === "" ||
        expiryDate.trim() === "" ||
        cvv.trim() === ""
      ) {
        alert(
          "Please fill all card details."
        );
        return;
      }

      if (cardNumber.length !== 16) {
        alert(
          "Please enter a valid 16 digit card number."
        );
        return;
      }

      if (cvv.length !== 3) {
        alert(
          "Please enter a valid 3 digit CVV."
        );
        return;
      }
    }

    // ==========================================
    // NET BANKING VALIDATION
    // ==========================================

    if (
      paymentMethod === "NETBANKING"
    ) {
      if (
        bankName === "" ||
        accountNumber.trim() === "" ||
        ifscCode.trim() === ""
      ) {
        alert(
          "Please fill all net banking details."
        );
        return;
      }
    }

    // ==========================================
    // START PAYMENT
    // ==========================================

    try {
      setPaying(true);

      const response =
        await fetch(
          "http://localhost:5000/api/payments/pay",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              consumerNumber:
                bill.consumerNumber,

              billNumber:
                bill.billNumber,

              billMonth:
                bill.billingMonth,

              amount:
                bill.billAmount,

              paymentMethod:
                paymentMethod,
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "Payment Response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Payment failed"
        );
      }

      // ==========================================
      // PAYMENT SUCCESS
      // ==========================================

      setPaymentData(
        data.payment
      );

      setPaymentSuccess(true);

      alert(
        "Payment Successful!"
      );

    } catch (error) {
      console.error(
        "Payment Error:",
        error
      );

      alert(
        error.message ||
          "Payment failed."
      );
    } finally {
      setPaying(false);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-IN"
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="paybill-page">
        <div className="paybill-container">
          <h2>Loading Bill...</h2>

          <p>
            Please wait.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // BILL NOT FOUND
  // ==========================================

  if (!bill || !user) {
    return (
      <div className="paybill-page">
        <div className="paybill-container">
          <h2>
            No Pending Bill Found
          </h2>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="paybill-page">

      <div className="paybill-container">

        {/* HEADER */}

        <div className="paybill-header">

          <button
            className="back-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>

          <div className="pay-logo">
            <FaBolt />
          </div>

          <h1>
            Pay Electricity Bill
          </h1>

          <p>
            Secure & Smart Electricity
            Bill Payment
          </p>

        </div>

        {/* CONSUMER DETAILS */}

        <div className="consumer-card">

          <div className="section-title">
            <FaUser />

            <h2>
              Consumer Details
            </h2>
          </div>

          <div className="consumer-grid">

            <div className="detail-box">
              <FaUser />

              <div>
                <span>
                  Consumer Name
                </span>

                <strong>
                  {user.name}
                </strong>
              </div>
            </div>

            <div className="detail-box">
              <FaIdCard />

              <div>
                <span>
                  Consumer Number
                </span>

                <strong>
                  {user.consumerNumber}
                </strong>
              </div>
            </div>

            <div className="detail-box">
              <FaTachometerAlt />

              <div>
                <span>
                  Meter Number
                </span>

                <strong>
                  {user.meterNumber}
                </strong>
              </div>
            </div>

            <div className="detail-box">
              <FaCalendarAlt />

              <div>
                <span>
                  Bill Month
                </span>

                <strong>
                  {bill.billingMonth}
                </strong>
              </div>
            </div>

            <div className="detail-box">
              <FaBolt />

              <div>
                <span>
                  Units Consumed
                </span>

                <strong>
                  {bill.units} kWh
                </strong>
              </div>
            </div>

            <div className="detail-box">
              <FaCalendarAlt />

              <div>
                <span>
                  Due Date
                </span>

                <strong>
                  {formatDate(
                    bill.dueDate
                  )}
                </strong>
              </div>
            </div>

          </div>

        </div>

        {/* BILL SUMMARY */}

        <div className="bill-summary">

          <div>
            <span>
              Current Bill Amount
            </span>

            <h2>
              ₹{bill.billAmount}
            </h2>
          </div>

          <div className="bill-status">

            <FaMoneyBillWave />

            <span>
              Payment Pending
            </span>

          </div>

        </div>

        {/* PAYMENT SUCCESS */}

        {paymentSuccess ? (

          <div className="payment-success">

            <FaCheckCircle />

            <h2>
              Payment Successful!
            </h2>

            <p>
              Your electricity bill
              payment of{" "}
              <strong>
                ₹{bill.billAmount}
              </strong>{" "}
              has been completed
              successfully.
            </p>

            <p>
              Transaction ID:
              <strong>
                {" "}
                {paymentData?.transactionId}
              </strong>
            </p>

            <button
              className="receipt-btn"
              onClick={() => {
                navigate(
                  "/receipt",
                  {
                    state: {
                      payment:
                        paymentData,

                      bill:
                        bill,

                      user:
                        user,
                    },
                  }
                );
              }}
            >
              View Payment Receipt
            </button>

          </div>

        ) : (

          <div className="payment-card">

            <h2>
              Select Payment Method
            </h2>

            <p className="payment-subtitle">
              Choose your preferred
              payment option
            </p>

            {/* PAYMENT OPTIONS */}

            <div className="payment-options">

              <button
                className={
                  paymentMethod === "UPI"
                    ? "payment-option selected"
                    : "payment-option"
                }
                onClick={() =>
                  handlePaymentMethod(
                    "UPI"
                  )
                }
              >
                <FaMobileAlt />

                <span>
                  UPI
                </span>

                <small>
                  Google Pay / PhonePe /
                  Paytm
                </small>
              </button>

              <button
                className={
                  paymentMethod === "CARD"
                    ? "payment-option selected"
                    : "payment-option"
                }
                onClick={() =>
                  handlePaymentMethod(
                    "CARD"
                  )
                }
              >
                <FaCreditCard />

                <span>
                  Debit / Credit Card
                </span>

                <small>
                  Visa / Mastercard /
                  RuPay
                </small>
              </button>

              <button
                className={
                  paymentMethod === "NETBANKING"
                    ? "payment-option selected"
                    : "payment-option"
                }
                onClick={() =>
                  handlePaymentMethod(
                    "NETBANKING"
                  )
                }
              >
                <FaUniversity />

                <span>
                  Net Banking
                </span>

                <small>
                  All Major Banks
                </small>
              </button>

            </div>

            {/* UPI */}

            {paymentMethod === "UPI" && (
              <div className="payment-form">

                <h3>
                  <FaMobileAlt />
                  Enter UPI Details
                </h3>

                <label>
                  UPI ID
                </label>

                <input
                  type="text"
                  placeholder="example@upi"
                  value={upiId}
                  onChange={(e) =>
                    setUpiId(
                      e.target.value
                    )
                  }
                />

              </div>
            )}

            {/* CARD */}

            {paymentMethod === "CARD" && (
              <div className="payment-form">

                <h3>
                  <FaCreditCard />
                  Enter Card Details
                </h3>

                <label>
                  Card Number
                </label>

                <input
                  type="text"
                  maxLength="16"
                  placeholder="Enter 16 digit card number"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                />

                <label>
                  Card Holder Name
                </label>

                <input
                  type="text"
                  placeholder="Enter card holder name"
                  value={cardHolder}
                  onChange={(e) =>
                    setCardHolder(
                      e.target.value
                    )
                  }
                />

                <div className="form-row">

                  <div>
                    <label>
                      Expiry Date
                    </label>

                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={expiryDate}
                      onChange={(e) =>
                        setExpiryDate(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      CVV
                    </label>

                    <input
                      type="password"
                      maxLength="3"
                      placeholder="CVV"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(
                          e.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                    />
                  </div>

                </div>

              </div>
            )}

            {/* NET BANKING */}

            {paymentMethod === "NETBANKING" && (
              <div className="payment-form">

                <h3>
                  <FaUniversity />
                  Net Banking Details
                </h3>

                <label>
                  Select Bank
                </label>

                <select
                  value={bankName}
                  onChange={(e) =>
                    setBankName(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Your Bank
                  </option>

                  <option value="SBI">
                    State Bank of India
                  </option>

                  <option value="HDFC">
                    HDFC Bank
                  </option>

                  <option value="ICICI">
                    ICICI Bank
                  </option>

                  <option value="AXIS">
                    Axis Bank
                  </option>

                  <option value="BOB">
                    Bank of Baroda
                  </option>
                </select>

                <label>
                  Account Number
                </label>

                <input
                  type="text"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e) =>
                    setAccountNumber(
                      e.target.value
                    )
                  }
                />

                <label>
                  IFSC Code
                </label>

                <input
                  type="text"
                  placeholder="Enter IFSC code"
                  value={ifscCode}
                  onChange={(e) =>
                    setIfscCode(
                      e.target.value
                    )
                  }
                />

              </div>
            )}

            {/* PAY BUTTON */}

            <button
              className="pay-btn"
              onClick={handlePayment}
              disabled={paying}
            >
              <FaMoneyBillWave />

              {paying
                ? "Processing Payment..."
                : `Pay ₹${bill.billAmount} Now`}
            </button>

          </div>
        )}

      </div>

    </div>
  );
}

export default PayBill;