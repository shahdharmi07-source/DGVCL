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
  FaLightbulb
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
  // GET USER DATA
  // AND GET BILLS
  // ==========================================

  useEffect(() => {

    // Get logged in user
    const savedUser =
      localStorage.getItem("loggedInUser");


    // If user is not logged in
    if (!savedUser) {

      navigate("/login");

      return;

    }


    try {

      // Convert saved user string to object
      const userData =
        JSON.parse(savedUser);


      // Save user data
      setConsumer(userData);


      // Get consumer number
      const consumerNumber =
        userData.consumerNumber;


      // Check consumer number
      if (!consumerNumber) {

        console.log(
          "Consumer Number not found"
        );

        setLoadingBills(false);

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

            throw new Error(
              "Unable to fetch bills"
            );

          }

          return response.json();

        })

        .then((data) => {

          console.log(
            "Bills from Backend:",
            data
          );


          // Save bills
          setBills(
            data.bills || []
          );

        })

        .catch((error) => {

          console.error(
            "Bill Fetch Error:",
            error
          );

          setBills([]);

        })

        .finally(() => {

          setLoadingBills(false);

        });


    } catch (error) {

      console.error(
        "User Data Error:",
        error
      );


      // Remove wrong data
      localStorage.removeItem(
        "loggedInUser"
      );


      navigate("/login");

    }

  }, [navigate]);


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem(
      "loggedInUser"
    );

    localStorage.removeItem(
      "demoOTP"
    );

    localStorage.removeItem(
      "consumerNumber"
    );


    navigate(
      "/login",
      {
        replace: true
      }
    );

  };


  // ==========================================
  // LOADING USER
  // ==========================================

  if (!consumer) {

    return (

      <div className="loading-screen">

        <h2>
          Loading Dashboard...
        </h2>

        <p>
          Please wait...
        </p>

      </div>

    );

  }


  // ==========================================
  // GET LATEST BILL
  // ==========================================

  const currentBill =

    bills.length > 0

      ? bills[0]

      : null;


  // ==========================================
  // DASHBOARD
  // ==========================================

  return (

    <div className="dashboard">


      {/* ======================================
          SIDEBAR
      ======================================= */}

      <aside className="sidebar">


        {/* LOGO */}

        <div className="logo">

          <FaBolt className="logo-icon" />

          <div>

            <h2>
              DGVCL
            </h2>

            <span>
              Consumer Portal
            </span>

          </div>

        </div>


        {/* MENU */}

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

            <Link to="/MyProfile">

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

            <Link to="/PaymentHistory">

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

            <Link to="/notifications">

              <FaBell />

              <span>
                Notifications
              </span>

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

              Manage your electricity services efficiently.

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


            {/* USER ICON */}

            <div className="avatar">

              <FaUserCircle />

            </div>


            {/* USER DETAILS */}

            <div>

              <h2>

                {consumer.name}

              </h2>


              <p>

                <strong>
                  Consumer No :
                </strong>

                {" "}

                {consumer.consumerNumber}

              </p>


              <p>

                <strong>
                  Meter No :
                </strong>

                {" "}

                {consumer.meterNumber}

              </p>


              <p>

                <strong>
                  Mobile :
                </strong>

                {" "}

                {consumer.mobile}

              </p>


              <p>

                <strong>
                  Address :
                </strong>

                {" "}

                {consumer.address}

              </p>


              {/* EMAIL */}

              {consumer.email && (

                <p>

                  <strong>
                    Email :
                  </strong>

                  {" "}

                  {consumer.email}

                </p>

              )}


            </div>


          </div>


          {/* CONNECTION STATUS */}

          <div className="status">

            <FaCheckCircle />

            {consumer.connectionStatus || "Active"}

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

                ? `₹${currentBill.amount}`

                : "₹ ----"

              }

            </h2>

            <span>

              {currentBill

                ? currentBill.status

                : "No Bill"

              }

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

                : "--- kWh"

              }

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

                ? currentBill.dueDate

                : "-- / -- / ----"

              }

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
            QUICK ACTIONS
        =================================== */}

        <div className="quick">


          <h2>
            Quick Actions
          </h2>


          <div className="quick-grid">


            {/* PAY BILL */}

            <Link

              to="/paybill"

              className="quick-box"

            >

              <FaCreditCard />

              <p>
                Pay Bill
              </p>

            </Link>


            {/* DOWNLOAD BILL */}

            <Link

              to="/downloadbill"

              className="quick-box"

            >

              <FaDownload />

              <p>
                Download Bill
              </p>

            </Link>


            {/* COMPLAINT */}

            <Link

              to="/complaint"

              className="quick-box"

            >

              <FaExclamationCircle />

              <p>
                Register Complaint
              </p>

            </Link>


            {/* USAGE */}

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

          ) : bills.length === 0 ? (

            <p>
              No bills available.
            </p>

          ) : (

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

                  <tr key={bill._id}>


                    <td>

                      {bill.month}

                    </td>


                    <td>

                      {bill.units} kWh

                    </td>


                    <td>

                      ₹{bill.amount}

                    </td>


                    <td>

                      {bill.dueDate}

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

            <FaLightbulb className="ai-icon" />

          </div>


          <div>


            <h2>
              AI Energy Saving Tips
            </h2>


            <p>

              Your electricity usage can be reduced
              by following these smart recommendations.

            </p>


            <ul>


              <li>

                💡 Turn OFF unused electrical appliances.

              </li>


              <li>

                💡 Use LED bulbs for better efficiency.

              </li>


              <li>

                💡 Set AC temperature between 24°C - 26°C.

              </li>


              <li>

                💡 Monitor your monthly electricity usage.

              </li>


            </ul>


          </div>


        </div>


      </main>


    </div>

  );

}


export default ConsumerDashboard;