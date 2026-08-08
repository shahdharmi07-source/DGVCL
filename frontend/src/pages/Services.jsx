import React, { useState } from "react";
import "../styles/services.css";

function Services() {

  const [activeCard, setActiveCard] = useState(null);

  const toggleCard = (index) => {
    if (activeCard === index) {
      setActiveCard(null);
    } else {
      setActiveCard(index);
    }
  };

  const services = [

    {
      title: "View Electricity Bill",
      image:
        "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=800&q=80",
      desc:
        "View, download and print your latest electricity bills anytime.",
      details:
        "Consumers can easily view current and previous electricity bills, download PDF copies and print them whenever required."
    },

    {
      title: "Online Bill Payment",
      image:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=80",
      desc:
        "Pay your electricity bill securely using digital payment methods.",
      details:
        "Pay your electricity bill instantly using UPI, Debit Card, Credit Card or Net Banking with secure payment."
    },

    {
      title: "Register Complaint",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      desc:
        "Submit complaints related to power supply and track their status.",
      details:
        "Register complaints for power failure, meter issues or voltage fluctuations and check complaint status online."
    },

    {
      title: "Meter Reading",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      desc:
        "Monitor electricity consumption and monthly usage reports.",
      details:
        "View monthly electricity consumption, meter readings and estimated bill details in one place."
    },

    {
      title: "New Connection",
      image:
        "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=800&q=80",
      desc:
        "Apply online for a new electricity connection quickly.",
      details:
        "Apply for a new electricity connection online and track your application until approval."
    },

    {
      title: "AI Energy Saving Tips",
      image:
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
      desc:
        "Get AI-based personalized electricity saving recommendations.",
      details:
        "Receive smart AI suggestions to reduce electricity usage, save energy and lower your monthly electricity bill."
    }

  ];

  return (

    <section className="services">

      <div className="service-title">

        <h2>Our Services</h2>

        <p>
          Smart Digital Electricity Services for Every Consumer
        </p>

      </div>

      <div className="service-grid">

        {services.map((item, index) => (

          <div className="service-card" key={index}>

            <img
              src={item.image}
              alt={item.title}
            />

            <div className="service-content">

              <h3>{item.title}</h3>

              <p>{item.desc}</p>

              <button
                onClick={() => toggleCard(index)}
              >
                {activeCard === index ? "Hide Details" : "View Details"}
              </button>

              {activeCard === index && (

                <div className="service-details">

                  <p>{item.details}</p>

                </div>

              )}

            </div>

          </div>

        ))}

      </div>

    </section>

  );

}

export default Services;