import React from "react";
import "../styles/about.css";

function About() {

  return (

    <section className="about">

      {/* Hero Section */}

      <section className="about-hero">

        <div className="hero-overlay"></div>

        <div className="about-hero-content">

          <span>⚡ DIGITAL GUJARAT POWER SYSTEM</span>

          <h1>
            Powering Gujarat With
            <br />
            Smart Digital Solutions
          </h1>

          <p>
            Secure • Reliable • Transparent Electricity Services
            for Every Consumer.
          </p>

        </div>

      </section>

      {/* About Section */}

      <section className="about-wrapper">

        <div className="about-left">

          <img
            src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80"
            alt="Power Transmission"
          />

        </div>

        <div className="about-right">

          <h5>ABOUT US</h5>

          <h2>
            Smart Electricity
            Consumer Portal
          </h2>

          <p>

            Digital Gujarat Power System is a modern electricity
            management platform designed to provide consumers with
            secure, fast and transparent online electricity services.

            Consumers can view bills, pay electricity bills,
            register complaints, monitor electricity usage and
            receive notifications from a single dashboard.

          </p>

          <div className="about-points">

            <div>⚡ 24×7 Consumer Support</div>

            <div>💳 Secure Online Payment</div>

            <div>📱 Smart Digital Services</div>

            <div>🌱 Energy Saving Solutions</div>

          </div>

        </div>

      </section>

      {/* Mission */}

      <section className="mission-section">

        <div className="mission-content">

          <h2>Our Mission</h2>

          <p>

            Our mission is to provide reliable,
            secure and digital electricity services
            that improve customer experience and
            promote paperless energy management.

          </p>

        </div>

        <div className="mission-image">

          <img
            src="https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=900&q=80"
            alt="Mission"
          />

        </div>

      </section>

      {/* Vision */}

      <section className="vision-section">

        <div className="vision-image">

          <img
            src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=900&q=80"
            alt="Vision"
          />

        </div>

        <div className="vision-content">

          <h2>Our Vision</h2>

          <p>

            To build a smart, sustainable and
            consumer-friendly electricity ecosystem
            where every service is available online
            with complete transparency.

          </p>

        </div>

      </section>

      {/* Statistics */}

      <section className="stats">

        <div className="stat-card">

          <h2>10L+</h2>

          <p>Consumers</p>

        </div>

        <div className="stat-card">

          <h2>99.9%</h2>

          <p>Service Uptime</p>

        </div>

        <div className="stat-card">

          <h2>24×7</h2>

          <p>Customer Support</p>

        </div>

        <div className="stat-card">

          <h2>100%</h2>

          <p>Digital Services</p>

        </div>

      </section>

      {/* Gallery */}

      <section className="gallery">

        <h2>Power Infrastructure</h2>

        <div className="gallery-grid">

          <img
            src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80"
            alt="Electric Tower"
          />

          <img
            src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=900&q=80"
            alt="Power Grid"
          />

          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80"
            alt="Control Room"
          />

        </div>

      </section>

    </section>

  );

}

export default About;