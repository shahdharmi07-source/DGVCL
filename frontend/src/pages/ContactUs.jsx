import React from "react";
import "../styles/contactus.css";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
  FaBolt,
  FaCreditCard,
  FaPlug
} from "react-icons/fa";

function ContactUs() {

  return (

    <div className="contact-page">

      {/* ================= HERO ================= */}

      <section className="contact-hero">

        <div className="hero-overlay"></div>

        <div className="hero-text">

          <h1>Contact DGPS</h1>

          <p>
            We are always ready to assist you with electricity services,
            billing support, complaints and new connection requests.
          </p>

        </div>

      </section>

      {/* ================= CONTACT ================= */}

      <section className="contact-container">

        {/* LEFT */}

        <div className="contact-info">

          <h2>Get In Touch</h2>

          <p>
            Feel free to contact us for any electricity related queries.
            Our support team is available to help consumers quickly.
          </p>

          <div className="info-box">

            <FaMapMarkerAlt className="info-icon"/>

            <div>

              <h3>Office Address</h3>

              <span>
                Dakshin Gujarat Vij Company Ltd.
                <br/>
                Surat, Gujarat - India
              </span>

            </div>

          </div>

          <div className="info-box">

            <FaPhoneAlt className="info-icon"/>

            <div>

              <h3>Helpline</h3>

              <span>
                19123
                <br/>
                9537623135
              </span>

            </div>

          </div>

          <div className="info-box">

            <FaEnvelope className="info-icon"/>

            <div>

              <h3>Email Support</h3>

              <span>
                support@DGPS.co.in
              </span>

            </div>

          </div>

          <div className="info-box">

            <FaClock className="info-icon"/>

            <div>

              <h3>Office Hours</h3>

              <span>
                Monday - Saturday
                <br/>
                10:00 AM - 6:00 PM
              </span>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="contact-form">

          <h2>Send Message</h2>

          <form>

            <input
              type="text"
              placeholder="Enter Your Name"
            />

            <input
              type="email"
              placeholder="Enter Email Address"
            />

            <input
              type="text"
              placeholder="Mobile Number"
            />

            <input
              type="text"
              placeholder="Consumer Number"
            />

            <textarea
              rows="6"
              placeholder="Write Your Message"
            ></textarea>

            <button>

              <FaPaperPlane />

              Send Message

            </button>

          </form>

        </div>

      </section>
            {/* ================= QUICK SUPPORT ================= */}

      <section className="support-section">

        <h2>Quick Support</h2>

        <p>
          Choose the service you need and get assistance instantly.
        </p>

        <div className="support-grid">

          <div className="support-card">

            <div className="support-icon emergency">

              <FaPhoneAlt />

            </div>

            <h3>Emergency Helpline</h3>

            <p>
              Report power failures, transformer faults and emergency electricity issues anytime.
            </p>

            <h4>19123</h4>

          </div>

          <div className="support-card">

            <div className="support-icon billing">

              <FaCreditCard />

            </div>

            <h3>Billing Support</h3>

            <p>
              Need help with electricity bills, payment issues or billing history? We're here to help.
            </p>

            <h4>Bill Assistance</h4>

          </div>

          <div className="support-card">

            <div className="support-icon connection">

              <FaPlug />

            </div>

            <h3>New Connection</h3>

            <p>
              Apply for a new electricity connection or check the application status online.
            </p>

            <h4>Apply Online</h4>

          </div>

        </div>

      </section>

      {/* ================= GOOGLE MAP ================= */}

      <section className="map-section">

        <h2>Visit Our Office</h2>

        <p>
          Find our office location in Surat, Gujarat.
        </p>

        <div className="map-box">

          <iframe
            title="DGVCL Office"
            src="https://maps.google.com/maps?q=Surat%20Gujarat&t=&z=13&ie=UTF8&iwloc=&output=embed"
            loading="lazy"
            allowFullScreen
          ></iframe>

        </div>

      </section>

      {/* ================= FOOTER BANNER ================= */}

      <section className="contact-banner">

        <FaBolt className="banner-icon" />

        <h2>Powering South Gujarat Digitally</h2>

        <p>
          Fast • Secure • Reliable Electricity Services for Every Consumer
        </p>

      </section>

    </div>

  );

}

export default ContactUs;