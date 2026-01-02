import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaGoogle,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="pro-footer">
      <div className="pro-footer-container">

        {/* SOCIAL ICONS */}
        <div className="social-row">
          <a
            href="https://www.facebook.com/profile.php?id=61585945261642"
            target="_blank"
            rel="noreferrer"
            className="social-icon"
          >
            <FaFacebookF />
          </a>

          <a
            href="https://www.instagram.com/tizellshoppingstore/"
            target="_blank"
            rel="noreferrer"
            className="social-icon"
          >
            <FaInstagram />
          </a>

          <a
            href="https://wa.me/message/FUDMEYYCY4ZHC1"
            target="_blank"
            rel="noreferrer"
            className="social-icon"
          >
            <FaWhatsapp />
          </a>

          <a
            href="https://www.google.com/search?q=Tizell"
            target="_blank"
            rel="noreferrer"
            className="social-icon"
          >
            <FaGoogle />
          </a>

          <a
            href="https://www.youtube.com/channel/UCCZF7G_gqKvFlOB5vVZzvjA"
            target="_blank"
            rel="noreferrer"
            className="social-icon"
          >
            <FaYoutube />
          </a>
        </div>

        {/* POLICY LINKS */}
        <div className="footer-nav">
          <a href="https://merchant.razorpay.com/policy/RqCeum70ELwpPL/refund" target="_blank" rel="noreferrer">
            Cancellation & Refund
          </a>

          <a href="https://merchant.razorpay.com/policy/RqCeum70ELwpPL/terms" target="_blank" rel="noreferrer">
            Terms & Conditions
          </a>

          <a href="https://merchant.razorpay.com/policy/RqCeum70ELwpPL/shipping" target="_blank" rel="noreferrer">
            Shipping Policy
          </a>

          <a href="https://merchant.razorpay.com/policy/RqCeum70ELwpPL/privacy" target="_blank" rel="noreferrer">
            Privacy Policy
          </a>

          <a href="https://merchant.razorpay.com/policy/RqCeum70ELwpPL/contact_us" target="_blank" rel="noreferrer">
            Contact Us
          </a>
        </div>

        {/* COPYRIGHT */}
        <div className="footer-copy">
          © {new Date().getFullYear()} Tizell. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
