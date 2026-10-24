import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBolt,
  FaRobot,
  FaPaperPlane,
  FaArrowLeft,
  FaExclamationCircle,
} from "react-icons/fa";

import "../styles/complaint.css";

function Complaint() {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [message, setMessage] = useState("");

  const [chat, setChat] = useState([
    {
      type: "ai",
      text:
        "Hello! 👋 I am DGPS AI Assistant. Please tell me your electricity problem. I will analyze your issue and guide you with the best solution.",
    },
  ]);

  const [lastComplaint, setLastComplaint] = useState(null);

  const [registering, setRegistering] = useState(false);

  // =====================================================
  // AI RESPONSE FUNCTION
  // =====================================================

  const getAIResponse = (userMessage) => {
    const text = userMessage.toLowerCase().trim();

    // =====================================================
    // POWER / NO ELECTRICITY
    // =====================================================

    if (
      text.includes("light nahi") ||
      text.includes("light nhi") ||
      text.includes("power nahi") ||
      text.includes("power nhi") ||
      text.includes("electricity nahi") ||
      text.includes("electricity nhi") ||
      text.includes("no electricity") ||
      text.includes("no power") ||
      text.includes("power cut") ||
      text.includes("power outage") ||
      text.includes("bijli nahi") ||
      text.includes("bijli nhi") ||
      text.includes("light gayi") ||
      text.includes("light chali") ||
      text.includes("light band")
    ) {
      return {
        category: "Power Outage",
        text:
          "I understand that you are facing a power outage. 💡 Please check whether the MCB/main switch is ON and confirm if your neighbors are also facing the same issue. If the problem continues, you can register a Power Outage complaint. Our support team can investigate the issue.",
      };
    }

    // =====================================================
    // FREQUENT POWER CUT
    // =====================================================

    if (
      text.includes("bar bar light") ||
      text.includes("baar baar light") ||
      text.includes("frequent power") ||
      text.includes("frequent outage") ||
      text.includes("light baar baar") ||
      text.includes("light bar bar") ||
      text.includes("power cut frequently") ||
      text.includes("roz light") ||
      text.includes("daily power cut")
    ) {
      return {
        category: "Frequent Power Cut",
        text:
          "It looks like you are experiencing frequent power interruptions. ⚡ Please register a complaint with the approximate time and frequency of the outages. Our technical team can check the local supply and feeder issue.",
      };
    }

    // =====================================================
    // HIGH / LOW VOLTAGE
    // =====================================================

    if (
      text.includes("voltage") ||
      text.includes("low voltage") ||
      text.includes("high voltage") ||
      text.includes("voltage low") ||
      text.includes("voltage high") ||
      text.includes("voltage problem") ||
      text.includes("current kam") ||
      text.includes("current jyada")
    ) {
      return {
        category: "Voltage Problem",
        text:
          "You appear to be facing a voltage-related problem. ⚠️ Please switch off sensitive electrical appliances to avoid damage. You can register a Voltage Complaint so that the technical team can inspect the supply.",
      };
    }

    // =====================================================
    // BILL PROBLEM
    // =====================================================

    if (
      text.includes("bill") ||
      text.includes("billing") ||
      text.includes("bill problem") ||
      text.includes("bill galat") ||
      text.includes("wrong bill") ||
      text.includes("bill zyada") ||
      text.includes("bill jyada") ||
      text.includes("high bill") ||
      text.includes("extra bill") ||
      text.includes("bill amount")
    ) {
      return {
        category: "Billing Issue",
        text:
          "I understand that you are facing a billing-related issue. 🧾 Please check your latest bill, previous bill and units consumed. If the amount or units appear incorrect, you can register a Billing Complaint for verification by the support team.",
      };
    }

    // =====================================================
    // PAYMENT PROBLEM
    // =====================================================

    if (
      text.includes("payment") ||
      text.includes("paid") ||
      text.includes("transaction") ||
      text.includes("money deducted") ||
      text.includes("paise kat") ||
      text.includes("payment failed") ||
      text.includes("payment pending") ||
      text.includes("payment nahi") ||
      text.includes("payment nhi") ||
      text.includes("upi") ||
      text.includes("online payment")
    ) {
      return {
        category: "Payment Issue",
        text:
          "This appears to be a payment-related issue. 💳 Please check your Payment History and transaction status. If money was deducted but the bill is still showing unpaid, please register a Payment Complaint and provide your transaction ID for verification.",
      };
    }

    // =====================================================
    // METER PROBLEM
    // =====================================================

    if (
      text.includes("meter") ||
      text.includes("meter kharab") ||
      text.includes("meter problem") ||
      text.includes("meter band") ||
      text.includes("meter not working") ||
      text.includes("meter reading") ||
      text.includes("reading wrong") ||
      text.includes("meter reading wrong") ||
      text.includes("meter damage")
    ) {
      return {
        category: "Meter Issue",
        text:
          "It looks like you are facing a meter-related problem. 🔌 Please keep your meter number ready and register a Meter Complaint. Our technical team can inspect the meter and verify the meter reading or condition.",
      };
    }

    // =====================================================
    // ELECTRICAL SAFETY
    // =====================================================

    if (
      text.includes("spark") ||
      text.includes("sparking") ||
      text.includes("wire") ||
      text.includes("wire damage") ||
      text.includes("wire broken") ||
      text.includes("electric shock") ||
      text.includes("shock") ||
      text.includes("burning smell") ||
      text.includes("fire") ||
      text.includes("short circuit")
    ) {
      return {
        category: "Electrical Safety",
        text:
          "⚠️ This may be an electrical safety issue. Please do not touch damaged wires, meters or electrical equipment. Keep people away from the affected area and switch off the main supply if it is safe to do so. Register an urgent electrical complaint so the technical team can inspect it.",
      };
    }

    // =====================================================
    // NEW CONNECTION
    // =====================================================

    if (
      text.includes("new connection") ||
      text.includes("new electricity connection") ||
      text.includes("connection chahiye") ||
      text.includes("connection lena") ||
      text.includes("naya connection") ||
      text.includes("electric connection")
    ) {
      return {
        category: "New Connection",
        text:
          "For a new electricity connection, you can submit a New Connection Request through the DGPS portal. 🏠 You may need to provide your address and required documents. After submission, you can track the request status.",
      };
    }

    // =====================================================
    // CONNECTION DISCONNECTION
    // =====================================================

    if (
      text.includes("connection band") ||
      text.includes("disconnect") ||
      text.includes("disconnection") ||
      text.includes("connection close")
    ) {
      return {
        category: "Connection Request",
        text:
          "If you want to disconnect or close your electricity connection, please submit the appropriate connection request through the portal. Make sure your consumer number and required details are available.",
      };
    }

    // =====================================================
    // LOAD INCREASE / DECREASE
    // =====================================================

    if (
      text.includes("load increase") ||
      text.includes("load badhana") ||
      text.includes("load kam") ||
      text.includes("load decrease") ||
      text.includes("sanctioned load") ||
      text.includes("load change")
    ) {
      return {
        category: "Load Change",
        text:
          "For increasing or decreasing your sanctioned electricity load, you can submit a Load Change Request. ⚡ Please provide your consumer details and required information for verification.",
      };
    }

    // =====================================================
    // NAME CHANGE
    // =====================================================

    if (
      text.includes("name change") ||
      text.includes("naam change") ||
      text.includes("name correction") ||
      text.includes("owner name") ||
      text.includes("naam galat")
    ) {
      return {
        category: "Name Change",
        text:
          "For changing or correcting the consumer name, you can submit a Name Change Request. 📝 You may need to provide supporting documents for verification.",
      };
    }

    // =====================================================
    // COMPLAINT STATUS
    // =====================================================

    if (
      text.includes("complaint status") ||
      text.includes("complaint kaha") ||
      text.includes("complaint check") ||
      text.includes("complaint track") ||
      text.includes("complaint tracking") ||
      text.includes("meri complaint") ||
      text.includes("complaint ka status")
    ) {
      return {
        category: "Complaint Status",
        text:
          "You can check your complaint status using your Complaint ID. 🔎 If you have already registered a complaint, please open the Complaint Status section to view whether it is Pending, In Progress or Resolved.",
      };
    }

    // =====================================================
    // GREETING
    // =====================================================

    if (
      text === "hi" ||
      text === "hello" ||
      text === "hey" ||
      text.includes("good morning") ||
      text.includes("good afternoon") ||
      text.includes("namaste")
    ) {
      return {
        category: "General",
        text:
          "Hello! 👋 I am your DGPS AI Assistant. You can tell me about problems related to electricity supply, billing, payments, meter, voltage, connection or any other electricity service issue.",
      };
    }

    // =====================================================
    // THANK YOU
    // =====================================================

    if (
      text.includes("thank you") ||
      text.includes("thanks") ||
      text.includes("thank")
    ) {
      return {
        category: "General",
        text:
          "You're welcome! 😊 If you have any other electricity-related problem, feel free to describe it and I will try to guide you.",
      };
    }

    // =====================================================
    // GENERAL ELECTRICITY PROBLEM
    // =====================================================

    if (
      text.includes("electric") ||
      text.includes("bijli") ||
      text.includes("problem") ||
      text.includes("issue") ||
      text.includes("service") ||
      text.includes("complaint") ||
      text.includes("problem hai")
    ) {
      return {
        category: "General Electricity Issue",
        text:
          "I understand that you are facing an electricity service issue. 🔎 Please provide a little more information, such as whether the problem is related to power supply, bill, payment, meter, voltage, connection or another service. This will help me guide you correctly.",
      };
    }

    // =====================================================
    // UNKNOWN QUERY
    // =====================================================

    return {
      category: "Need More Information",
      text:
        "I want to help you with this issue. 😊 Please provide a little more detail about your problem. For example, tell me what is happening, when it started, and whether it is related to electricity supply, bill, payment, meter, voltage or connection.",
    };
  };

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const handleSend = () => {
    if (message.trim() === "") {
      alert("Please describe your complaint.");
      return;
    }

    const userText = message.trim();

    const aiResponse = getAIResponse(userText);

    setLastComplaint({
      text: userText,
      category: aiResponse.category,
    });

    setChat((previousChat) => [
      ...previousChat,

      {
        type: "user",
        text: userText,
      },

      {
        type: "ai",
        text: aiResponse.text,
      },
    ]);

    setMessage("");
  };

  // =====================================================
  // REGISTER COMPLAINT
  // =====================================================

  const registerComplaint = async () => {
    if (!lastComplaint) {
      alert("Please describe and send your complaint first.");
      return;
    }

    try {
      setRegistering(true);

      // =================================================
      // GET LOGGED-IN USER
      // =================================================

      const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser") || "null"
      );

      // =================================================
      // GET CONSUMER NUMBER
      // =================================================

      const consumerNumber =
        localStorage.getItem("consumerNumber") ||
        loggedInUser?.consumerNumber ||
        loggedInUser?.consumerNo ||
        "";

      // =================================================
      // GET CONSUMER NAME
      // =================================================

      const consumerName =
        loggedInUser?.name ||
        loggedInUser?.fullName ||
        loggedInUser?.username ||
        "Unknown Consumer";

      // =================================================
      // CHECK CONSUMER NUMBER
      // =================================================

      if (!consumerNumber.trim()) {
        alert(
          "Consumer Number not found. Please login again."
        );

        navigate("/login");

        return;
      }

      console.log(
        "Consumer Name:",
        consumerName
      );

      console.log(
        "Consumer Number:",
        consumerNumber
      );

      console.log(
        "Complaint:",
        lastComplaint
      );

      // =================================================
      // SEND DATA TO BACKEND
      // =================================================

      const response = await fetch(
        "http://localhost:5000/api/complaints",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            consumerName: consumerName,

            consumerNumber:
              consumerNumber.trim(),

            category:
              lastComplaint.category,

            description:
              lastComplaint.text,

            status: "Pending",
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Complaint Backend Response:",
        data
      );

      // =================================================
      // BACKEND ERROR
      // =================================================

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to register complaint."
        );

        return;
      }

      // =================================================
      // SUCCESS
      // =================================================

      const complaintId =
        data.complaint?.complaintId ||
        data.complaint?._id ||
        "Generated";

      alert(
        "✅ Complaint Registered Successfully!\n\n" +
          "Complaint ID: " +
          complaintId +
          "\n\n" +
          "Consumer Name: " +
          consumerName +
          "\n\n" +
          "Consumer Number: " +
          consumerNumber +
          "\n\n" +
          "Category: " +
          lastComplaint.category +
          "\n\n" +
          "Our support team will review your complaint."
      );

      // Clear current complaint

      setLastComplaint(null);

    } catch (error) {
      console.error(
        "Register Complaint Error:",
        error
      );

      alert(
        "❌ Unable to connect to backend.\n\nPlease make sure Node.js server is running."
      );
    } finally {
      setRegistering(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="complaint-page">

      <div className="complaint-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="complaint-header">

          <div className="complaint-logo">
            <FaBolt />
          </div>

          <div>

            <h1>
              AI Complaint Assistant
            </h1>

            <p>
              Smart Electricity Consumer Support
            </p>

          </div>

        </div>

        {/* =================================================
            AI BANNER
        ================================================= */}

        <div className="ai-banner">

          <FaRobot />

          <div>

            <h3>
              How can I help you?
            </h3>

            <p>
              Describe your electricity problem in your own words.
            </p>

          </div>

        </div>

        {/* =================================================
            CHAT AREA
        ================================================= */}

        <div className="chat-box">

          {chat.map((item, index) => (

            <div
              key={index}
              className={
                item.type === "ai"
                  ? "chat-message ai-message"
                  : "chat-message user-message"
              }
            >

              {item.type === "ai" && (
                <FaRobot />
              )}

              <span>
                {item.text}
              </span>

            </div>

          ))}

        </div>

        {/* =================================================
            INPUT
        ================================================= */}

        <div className="chat-input">

          <input
            type="text"
            placeholder="Describe your electricity problem..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {
                handleSend();
              }

            }}
          />

          <button
            onClick={handleSend}
            disabled={registering}
          >
            <FaPaperPlane />
          </button>

        </div>

        {/* =================================================
            REGISTER COMPLAINT
        ================================================= */}

        <button
          className="register-btn"
          onClick={registerComplaint}
          disabled={
            registering ||
            !lastComplaint
          }
        >

          <FaExclamationCircle />

          {registering
            ? "Registering..."
            : "Register Complaint"}

        </button>

        {/* =================================================
            COMPLAINT READY
        ================================================= */}

        {lastComplaint && (

          <div className="complaint-ready">

            <div className="ready-header">

              <FaExclamationCircle />

              <strong>
                Complaint Ready
              </strong>

            </div>

            <div className="ready-category">

              <span>
                Category
              </span>

              <strong>
                {lastComplaint.category}
              </strong>

            </div>

            <div className="ready-description">

              <span>
                Your Complaint
              </span>

              <p>
                {lastComplaint.text}
              </p>

            </div>

            <div className="ready-note">

              Click "Register Complaint" to save
              this complaint in the DGPS system.

            </div>

          </div>

        )}

        {/* =================================================
            BACK BUTTON
        ================================================= */}

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

    </div>
  );
}

export default Complaint;