import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaBolt,
  FaUserCircle,
  FaHome,
  FaFileInvoiceDollar,
  FaHistory,
  FaExclamationCircle,
  FaBell,
  FaSignOutAlt,
  FaCheckCircle,
  FaCreditCard,
  FaDownload,
  FaChartLine,
  FaLightbulb,
} from "react-icons/fa";

import "../styles/dashboard.css";

function ConsumerDashboard() {
  const navigate = useNavigate();

  // ==========================================
  // USER DATA
  // ==========================================

  const [consumer, setConsumer] = useState(null);

  // ==========================================
  // BILL DATA
  // ==========================================

  const [bills, setBills] = useState([]);
  const [loadingBills, setLoadingBills] = useState(true);

  // ==========================================
  // NOTIFICATION DATA
  // ==========================================

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] =
    useState(true);

  // ==========================================
  // GET USER + BILLS + NOTIFICATIONS
  // ==========================================

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");

    // ==========================================
    // CHECK LOGIN
    // ==========================================

    if (!savedUser) {
      navigate("/login");
      return;
    }

    try {
      // ==========================================
      // CONVERT USER DATA
      // ==========================================

      const userData = JSON.parse(savedUser);

      // ==========================================
      // SAVE USER DATA
      // ==========================================

      setConsumer(userData);

      // ==========================================
      // GET CONSUMER NUMBER
      // ==========================================

      const consumerNumber = userData.consumerNumber;

      // ==========================================
      // CHECK CONSUMER NUMBER
      // ==========================================

      if (!consumerNumber) {
        console.log("Consumer Number not found");

        setLoadingBills(false);
        setLoadingNotifications(false);

        return;
      }

      // ==========================================
      // GET BILLS FROM BACKEND
      // ==========================================

      fetch(
        `http://localhost:5000/api/bills/${consumerNumber}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Unable to fetch bills");
          }

          return response.json();
        })
        .then((data) => {
          console.log("Bills from Backend:", data);

          setBills(data.bills || []);
        })
        .catch((error) => {
          console.error("Bill Fetch Error:", error);

          setBills([]);
        })
        .finally(() => {
          setLoadingBills(false);
        });

      // ==========================================
      // GET NOTIFICATIONS FROM BACKEND
      // ==========================================

      fetch(
        `http://localhost:5000/api/notifications/${consumerNumber}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Unable to fetch notifications"
            );
          }

          return response.json();
        })
        .then((data) => {
          console.log(
            "Notifications from Backend:",
            data
          );

          setNotifications(
            data.notifications || []
          );
        })
        .catch((error) => {
          console.error(
            "Notification Fetch Error:",
            error
          );

          setNotifications([]);
        })
        .finally(() => {
          setLoadingNotifications(false);
        });
    } catch (error) {
      console.error("User Data Error:", error);

      localStorage.removeItem("loggedInUser");

      navigate("/login");
    }
  }, [navigate]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("demoOTP");
    localStorage.removeItem("consumerNumber");

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================
  // LOADING USER
  // ==========================================

  if (!consumer) {
    return (
      <div className="loading-screen">
        <h2>Loading Dashboard...</h2>

        <p>Please wait...</p>
      </div>
    );
  }

  // ==========================================
  // GET LATEST BILL
  // ==========================================

  const currentBill =
    bills.length > 0 ? bills[0] : null;

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-- / -- / ----";
    }

    return new Date(date).toLocaleDateString(
      "en-IN"
    );
  };

  // ==========================================
  // CREATE AUTOMATIC BILL NOTIFICATION
  // ==========================================

  const billNotification =
    currentBill &&
    currentBill.status &&
    currentBill.status.toLowerCase() !== "paid"
      ? {
          _id: "bill-notification",
          id: "bill-notification",

          title: "Payment Pending",

          message:
            `Your electricity bill of ₹${currentBill.billAmount} ` +
            `is pending. Please pay before ` +
            `${formatDate(currentBill.dueDate)}.`,

          type: "Bill Due",

          priority: "high",

          read: false,

          createdAt: new Date(),
        }
      : null;

  // ==========================================
  // COMBINE BACKEND + BILL NOTIFICATION
  // ==========================================

  const dashboardNotifications = [
    ...(billNotification
      ? [billNotification]
      : []),

    ...notifications,
  ];

  // ==========================================
  // UNREAD NOTIFICATION COUNT
  // ==========================================

  const notificationCount =
    dashboardNotifications.filter(
      (notification) =>
        notification.read !== true &&
        notification.isRead !== true
    ).length;

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="dashboard">

      {/* ======================================
          SIDEBAR
      ======================================= */}

      <aside className="sidebar">

        {/* ======================================
            LOGO
        ======================================= */}

        <div className="logo">

          <FaBolt className="logo-icon" />

          <div>
            <h2>DGPS</h2>

            <span>
              Consumer Portal
            </span>
          </div>

        </div>

        {/* ======================================
            MENU
        ======================================= */}

        <ul className="menu">

          {/* DASHBOARD */}

          <li className="active">

            <Link to="/dashboard">

              <FaHome />

              <span>
                Dashboard
              </span>

            </Link>

          </li>

          {/* PROFILE */}

          <li>

            <Link to="/myprofile">

              <FaUserCircle />

              <span>
                My Profile
              </span>

            </Link>

          </li>

          {/* BILLS */}

          <li>

            <Link to="/bills">

              <FaFileInvoiceDollar />

              <span>
                My Bills
              </span>

            </Link>

          </li>

          {/* PAYMENT HISTORY */}

          <li>

            <Link to="/paymenthistory">

              <FaHistory />

              <span>
                Payment History
              </span>

            </Link>

          </li>

          {/* COMPLAINT */}

          <li>

            <Link to="/complaint">

              <FaExclamationCircle />

              <span>
                Complaint
              </span>

            </Link>

          </li>

          {/* NOTIFICATIONS */}

          <li>

            <Link to="/notification">

              <FaBell />

              <span>
                Notifications
              </span>

              {notificationCount > 0 && (
                <span className="notification-count">
                  {notificationCount}
                </span>
              )}

            </Link>

          </li>

        </ul>

      </aside>

      {/* ======================================
          MAIN CONTENT
      ======================================= */}

      <main className="main-content">

        {/* ==================================
            TOPBAR
        =================================== */}

        <div className="topbar">

          <div>

            <h1>
              Welcome, {consumer.name} 👋
            </h1>

            <p>
              Manage your electricity services
              efficiently.
            </p>

          </div>

          {/* LOGOUT */}

          <button
            className="logout"
            onClick={handleLogout}
          >

            <FaSignOutAlt />

            Logout

          </button>

        </div>

        {/* ==================================
            PROFILE CARD
        =================================== */}

        <div className="profile-card">

          <div className="profile-left">

            <div className="avatar">
              <FaUserCircle />
            </div>

            <div>

              <h2>
                {consumer.name}
              </h2>

              <p>
                <strong>
                  Consumer No :
                </strong>{" "}
                {consumer.consumerNumber}
              </p>

              <p>
                <strong>
                  Meter No :
                </strong>{" "}
                {consumer.meterNumber}
              </p>

              <p>
                <strong>
                  Mobile :
                </strong>{" "}
                {consumer.mobile}
              </p>

              <p>
                <strong>
                  Address :
                </strong>{" "}
                {consumer.address}
              </p>

              {consumer.email && (
                <p>
                  <strong>
                    Email :
                  </strong>{" "}
                  {consumer.email}
                </p>
              )}

            </div>

          </div>

          {/* CONNECTION STATUS */}

          <div className="status">

            <FaCheckCircle />

            {consumer.connectionStatus ||
              "Active"}

          </div>

        </div>

        {/* ==================================
            DASHBOARD CARDS
        =================================== */}

        <div className="cards">

          {/* CURRENT BILL */}

          <div className="card">

            <h4>
              Current Bill
            </h4>

            <h2>

              {currentBill
                ? `₹${currentBill.billAmount}`
                : "₹ ----"}

            </h2>

            <span>

              {currentBill
                ? currentBill.status
                : "No Bill"}

            </span>

          </div>

          {/* UNITS */}

          <div className="card">

            <h4>
              Units Used
            </h4>

            <h2>

              {currentBill
                ? `${currentBill.units} kWh`
                : "--- kWh"}

            </h2>

            <span>
              This Month
            </span>

          </div>

          {/* DUE DATE */}

          <div className="card">

            <h4>
              Due Date
            </h4>

            <h2>

              {currentBill
                ? formatDate(currentBill.dueDate)
                : "-- / -- / ----"}

            </h2>

            <span>
              Upcoming
            </span>

          </div>

          {/* LAST PAYMENT */}

          <div className="card">

            <h4>
              Last Payment
            </h4>

            <h2>
              ₹ ----
            </h2>

            <span>
              No Payment Yet
            </span>

          </div>

        </div>

        {/* ==================================
            NOTIFICATIONS
        =================================== */}

        <div className="dashboard-notifications">

          <div className="notification-header">

            <div>

              <h2>

                <FaBell />

                Notifications

                {notificationCount > 0 && (
                  <span className="notification-header-count">
                    {notificationCount}
                  </span>
                )}

              </h2>

              <p>
                Important updates about
                your electricity account
              </p>

            </div>

            <Link
              to="/notification"
              className="view-all-notifications"
            >
              View All
            </Link>

          </div>

          {/* LOADING */}

          {loadingNotifications ? (

            <div className="notification-loading">

              <p>
                Loading notifications...
              </p>

            </div>

          )

          /* NO NOTIFICATIONS */

          : dashboardNotifications.length === 0 ? (

            <div className="no-notifications">

              <FaCheckCircle />

              <div>

                <h3>
                  No New Notifications
                </h3>

                <p>
                  Your electricity account
                  is up to date.
                </p>

              </div>

            </div>

          )

          /* NOTIFICATION LIST */

          : (

            <div className="notification-list">

              {dashboardNotifications
                .slice(0, 3)
                .map((notification, index) => {

                  const notificationKey =
                    notification._id ||
                    notification.id ||
                    `notification-${index}`;

                  const notificationType =
                    notification.priority ||
                    notification.type ||
                    "info";

                  return (

                    <div
                      className={
                        `dashboard-notification ${notificationType
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`
                      }

                      key={notificationKey}
                    >

                      <div className="notification-icon">
                        <FaBell />
                      </div>

                      <div className="notification-content">

                        <h3>
                          {notification.title}
                        </h3>

                        <p>
                          {notification.message}
                        </p>

                        {notification.createdAt && (
                          <small>

                            {new Date(
                              notification.createdAt
                            ).toLocaleDateString(
                              "en-IN"
                            )}

                          </small>
                        )}

                      </div>

                    </div>

                  );
                })}

            </div>

          )}

        </div>

        {/* ==================================
            QUICK ACTIONS
        =================================== */}

        <div className="quick">

          <h2>
            Quick Actions
          </h2>

          <div className="quick-grid">

            <Link
              to="/paybill"
              className="quick-box"
            >

              <FaCreditCard />

              <p>
                Pay Bill
              </p>

            </Link>

            <Link
              to="/downloadbill"
              className="quick-box"
            >

              <FaDownload />

              <p>
                Download Bill
              </p>

            </Link>

            <Link
              to="/complaint"
              className="quick-box"
            >

              <FaExclamationCircle />

              <p>
                Register Complaint
              </p>

            </Link>

            <Link
              to="/usage"
              className="quick-box"
            >

              <FaChartLine />

              <p>
                Usage Report
              </p>

            </Link>

          </div>

        </div>

        {/* ==================================
            RECENT BILLS
        =================================== */}

        <div className="bill-table">

          <h2>
            Recent Bills
          </h2>

          {loadingBills ? (

            <p>
              Loading bills...
            </p>

          )

          : bills.length === 0 ? (

            <p>
              No bills available.
            </p>

          )

          : (

            <table>

              <thead>

                <tr>

                  <th>
                    Month
                  </th>

                  <th>
                    Units
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Due Date
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {bills.map((bill) => (

                  <tr
                    key={
                      bill._id ||
                      bill.id
                    }
                  >

                    <td>
                      {bill.billingMonth}
                    </td>

                    <td>
                      {bill.units} kWh
                    </td>

                    <td>
                      ₹{bill.billAmount}
                    </td>

                    <td>
                      {formatDate(bill.dueDate)}
                    </td>

                    <td
                      className={
                        bill.status === "Paid"
                          ? "paid"
                          : "pending"
                      }
                    >
                      {bill.status}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

        {/* ==================================
            AI ENERGY SAVING CARD
        =================================== */}

        <div className="ai-card">

          <div>

            <FaLightbulb
              className="ai-icon"
            />

          </div>

          <div>

            <h2>
              AI Energy Saving Tips
            </h2>

            <p>
              Your electricity usage can be
              reduced by following these
              smart recommendations.
            </p>

            <ul>

              <li>
                💡 Turn OFF unused electrical
                appliances.
              </li>

              <li>
                💡 Use LED bulbs for better
                efficiency.
              </li>

              <li>
                💡 Set AC temperature between
                24°C - 26°C.
              </li>

              <li>
                💡 Monitor your monthly
                electricity usage.
              </li>

            </ul>

          </div>

        </div>

      </main>

    </div>
  );
}

export default ConsumerDashboard;