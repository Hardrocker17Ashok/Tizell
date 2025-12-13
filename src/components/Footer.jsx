import "./Footer.css";

const Footer = () => {
  return (
    <footer className="mega-footer">
      <div className="mega-footer-inner">

        <div className="mega-footer-brand">
          <h2>Tizell</h2>
          <p>
            © {new Date().getFullYear()} Tizell.  
            All rights reserved.
          </p>
          <p className="trust">
            Secure and compliant payments powered by Razorpay
          </p>
        </div>

        <div className="mega-footer-links">
          <a
            href="https://merchant.razorpay.com/policy/RqCeum70ELwpPL/refund"
            target="_blank"
            rel="noreferrer"
          >
            Cancellation & Refund Policy
          </a>

          <a
            href="https://merchant.razorpay.com/policy/RqCeum70ELwpPL/terms"
            target="_blank"
            rel="noreferrer"
          >
            Terms & Conditions
          </a>

          <a
            href="https://merchant.razorpay.com/policy/RqCeum70ELwpPL/shipping"
            target="_blank"
            rel="noreferrer"
          >
            Shipping Policy
          </a>

          <a
            href="https://merchant.razorpay.com/policy/RqCeum70ELwpPL/privacy"
            target="_blank"
            rel="noreferrer"
          >
            Privacy Policy
          </a>

          <a
            href="https://merchant.razorpay.com/policy/RqCeum70ELwpPL/contact_us"
            target="_blank"
            rel="noreferrer"
          >
            Contact Us
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
