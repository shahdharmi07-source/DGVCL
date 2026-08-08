import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBolt,
  FaRobot,
  FaPaperPlane,
  FaArrowLeft,
  FaExclamationCircle
} from "react-icons/fa";

import "../styles/complaint.css";

function Complaint() {

  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const [chat, setChat] = useState([
    {
      type: "ai",
      text: "Hello! 👋 I am DGPS AI Assistant. Please tell me your electricity problem. I will try to help you."
    }
  ]);

  const handleSend = () => {

    if (message.trim() === "") {

      alert("Please describe your complaint.");

      return;

    }

    const userMessage = message.toLowerCase();

    let reply =
      "Thank you for your complaint. Your issue has been noted. Please register your complaint so our support team can assist you.";

    if (
      userMessage.includes("light") ||
      userMessage.includes("power") ||
      userMessage.includes("electricity")
    ) {

      reply =
        "It looks like you are facing a power-related issue. 💡 Please check your main switch and MCB. If the problem continues, you can register a power outage complaint.";

    }

    else if (
      userMessage.includes("bill") ||
      userMessage.includes("payment")
    ) {

      reply =
        "For bill or payment issues, please check your latest bill and payment history. You can also register a billing complaint for further assistance.";

    }

    else if (
      userMessage.includes("meter")
    ) {

      reply =
        "For meter-related problems, please provide your meter number while registering the complaint. Our technical team can inspect the meter.";

    }

    else if (
      userMessage.includes("voltage")
    ) {

      reply =
        "For low or high voltage problems, please switch off sensitive appliances for safety. You can register a voltage complaint for technical support.";

    }

    setChat([
      ...chat,
      {
        type: "user",
        text: message
      },
      {
        type: "ai",
        text: reply
      }
    ]);

    setMessage("");

  };


  const registerComplaint = () => {

    alert(
      "✅ Complaint Registered Successfully!\n\nComplaint ID: DGPS-" +
      Math.floor(100000 + Math.random() * 900000)
    );

  };


  return (

    <div className="complaint-page">

      <div className="complaint-container">

        {/* Header */}

        <div className="complaint-header">

          <div className="complaint-logo">

            <FaBolt />

          </div>

          <div>

            <h1>AI Complaint Assistant</h1>

            <p>
              Smart Electricity Consumer Support
            </p>

          </div>

        </div>


        {/* AI Banner */}

        <div className="ai-banner">

          <FaRobot />

          <div>

            <h3>How can I help you?</h3>

            <p>
              Tell me about your electricity problem.
            </p>

          </div>

        </div>


        {/* Chat Area */}

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


        {/* Input */}

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

          <button onClick={handleSend}>

            <FaPaperPlane />

          </button>

        </div>


        {/* Register Complaint */}

        <button
          className="register-btn"
          onClick={registerComplaint}
        >

          <FaExclamationCircle />

          Register Complaint

        </button>


        {/* Back */}

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >

          <FaArrowLeft />

          Back to Dashboard

        </button>

      </div>

    </div>

  );

}

export default Complaint;