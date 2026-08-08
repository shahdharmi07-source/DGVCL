import "../styles/footer.css";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-box">

          <h2>DGVCL</h2>

          <p>
            Smart Electricity Consumer Portal providing secure,
            reliable and digital services for consumers across
            South Gujarat.
          </p>

        </div>

        <div className="footer-box">

          <h3>Quick Links</h3>

          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Services</li>
            <li>Consumer Login</li>
            <li>Contact</li>
          </ul>

        </div>

        <div className="footer-box">

          <h3>Consumer Services</h3>

          <ul>
            <li>Bill Payment</li>
            <li>Download Bill</li>
            <li>Complaint</li>
            <li>New Connection</li>
            <li>Meter Reading</li>
          </ul>

        </div>

        <div className="footer-box">

          <h3>Contact</h3>

          <p><FaPhoneAlt /> 19123</p>
          <p><FaEnvelope /> support@dgvcl.co.in</p>
          <p><FaMapMarkerAlt /> South Gujarat, Gujarat</p>

          <div className="social">

            <FaFacebookF />
            <FaInstagram />
            <FaLinkedinIn />

          </div>

        </div>

      </div>

      <div className="footer-bottom">

        © 2026 DGVCL Consumer Portal | Designed by Khushi Rana

      </div>

    </footer>
  );
}

export default Footer;