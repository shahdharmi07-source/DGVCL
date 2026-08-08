import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBolt,
  FaArrowLeft,
  FaChartLine,
  FaLightbulb,
  FaCalendarAlt,
  FaTachometerAlt
} from "react-icons/fa";

import "../styles/usage.css";

function Usage() {

  const navigate = useNavigate();

  // Demo Data
  // Later MongoDB / Backend se aayega

  const usageData = [
    { month: "Jan", units: 180 },
    { month: "Feb", units: 195 },
    { month: "Mar", units: 210 },
    { month: "Apr", units: 230 },
    { month: "May", units: 198 },
    { month: "Jun", units: 210 },
    { month: "Jul", units: 245 }
  ];

  const currentUsage = 245;

  const previousUsage = 210;

  const increase = (
    ((currentUsage - previousUsage) / previousUsage) *
    100
  ).toFixed(1);


  return (

    <div className="usage-page">

      <div className="usage-container">

        {/* ================= HEADER ================= */}

        <div className="usage-header">

          <div>

            <div className="usage-title">

              <div className="usage-icon">

                <FaBolt />

              </div>

              <div>

                <h1>Electricity Usage Report</h1>

                <p>
                  Monitor and analyze your monthly electricity consumption.
                </p>

              </div>

            </div>

          </div>


          <button
            className="back-dashboard"
            onClick={() => navigate("/dashboard")}
          >

            <FaArrowLeft />

            Dashboard

          </button>

        </div>


        {/* ================= SUMMARY CARDS ================= */}

        <div className="usage-cards">

          <div className="usage-card">

            <div className="card-icon blue">

              <FaTachometerAlt />

            </div>

            <div>

              <span>Current Usage</span>

              <h2>{currentUsage} kWh</h2>

              <p>This Month</p>

            </div>

          </div>


          <div className="usage-card">

            <div className="card-icon green">

              <FaChartLine />

            </div>

            <div>

              <span>Previous Usage</span>

              <h2>{previousUsage} kWh</h2>

              <p>Last Month</p>

            </div>

          </div>


          <div className="usage-card">

            <div className="card-icon orange">

              <FaCalendarAlt />

            </div>

            <div>

              <span>Usage Change</span>

              <h2>+{increase}%</h2>

              <p>Compared to Last Month</p>

            </div>

          </div>

        </div>


        {/* ================= MONTHLY USAGE ================= */}

        <div className="usage-section">

          <div className="section-heading">

            <div>

              <h2>Monthly Electricity Usage</h2>

              <p>
                Your electricity consumption for the last 7 months.
              </p>

            </div>

            <span className="unit-label">
              Unit: kWh
            </span>

          </div>


          <div className="chart">

            {usageData.map((item, index) => (

              <div
                className="bar-item"
                key={index}
              >

                <div className="bar-value">

                  {item.units}

                </div>

                <div
                  className="bar"
                  style={{
                    height: `${item.units / 2}px`
                  }}
                ></div>

                <span className="bar-month">

                  {item.month}

                </span>

              </div>

            ))}

          </div>

        </div>


        {/* ================= USAGE ANALYSIS ================= */}

        <div className="analysis-grid">

          <div className="analysis-card">

            <h2>Consumption Analysis</h2>

            <div className="analysis-status">

              <span className="status-dot"></span>

              <strong>High Usage</strong>

            </div>

            <p>

              Your electricity consumption has increased by{" "}

              <strong>{increase}%</strong>{" "}

              compared to the previous month.

            </p>

            <div className="progress">

              <div className="progress-bar"></div>

            </div>

            <small>
              Current Consumption: {currentUsage} kWh
            </small>

          </div>


          {/* ================= ESTIMATED BILL ================= */}

          <div className="bill-prediction">

            <h2>Estimated Next Bill</h2>

            <p>
              Based on your current electricity usage
            </p>

            <h1>₹1,280</h1>

            <span>
              Estimated Bill Amount
            </span>

          </div>

        </div>


        {/* ================= AI INSIGHT ================= */}

        <div className="ai-usage-card">

          <div className="ai-usage-icon">

            <FaLightbulb />

          </div>

          <div>

            <h2>AI Energy Insight</h2>

            <p>

              Your electricity consumption increased by{" "}

              <strong>{increase}%</strong>{" "}

              this month. This may be due to increased usage
              of air conditioners, fans or other high-power
              appliances.

            </p>

          </div>

        </div>


        {/* ================= ENERGY TIPS ================= */}

        <div className="tips-section">

          <h2>💡 Smart Energy Saving Tips</h2>

          <div className="tips-grid">

            <div className="tip-card">

              <span>💡</span>

              <h3>Use LED Bulbs</h3>

              <p>
                Replace traditional bulbs with energy-efficient
                LED lights.
              </p>

            </div>


            <div className="tip-card">

              <span>❄️</span>

              <h3>Optimize AC Usage</h3>

              <p>
                Keep your AC temperature between 24°C and 26°C
                to save electricity.
              </p>

            </div>


            <div className="tip-card">

              <span>🔌</span>

              <h3>Switch Off Appliances</h3>

              <p>
                Turn off appliances when they are not in use.
              </p>

            </div>


            <div className="tip-card">

              <span>📊</span>

              <h3>Monitor Usage</h3>

              <p>
                Regularly check your electricity usage to
                control your monthly bill.
              </p>

            </div>

          </div>

        </div>


        {/* ================= FOOTER BUTTON ================= */}

        <button
          className="usage-back-btn"
          onClick={() => navigate("/dashboard")}
        >

          <FaArrowLeft />

          Back to Consumer Dashboard

        </button>


      </div>

    </div>

  );

}

export default Usage;