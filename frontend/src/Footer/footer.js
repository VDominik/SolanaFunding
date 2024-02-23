import { NavLink } from "react-router-dom";
import "./footer.css";
import Logo from "./textBlack.png";
import XLogo from "./xlogo.png";
import LinkedInLogo from "./linkedinlogo.png";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-logo-wrapper">
        {/* <div className="footer-logo">
          <img src={Logo} alt="Logo" className="footer-logo" />
        </div> */}
      </div>
      <div className="footer-container">
        <div className="footer-socials">
          <div className="social-logo">
            <a href="/">
              <img src={XLogo} alt="Logo" className="footer-logo" />
            </a>
          </div>
          <div className="social-logo">
            <a href="/">
              <img src={LinkedInLogo} alt="Logo" className="footer-logo" />
            </a>
          </div>
        </div>

        <div className="subpages-wrapper">
          <NavLink to="/">Home</NavLink>

          <NavLink to="/blog">Blog</NavLink>

          <NavLink to="/app">Projects</NavLink>

          <NavLink to="/about">About</NavLink>

          <NavLink to="/faq">FAQ</NavLink>

          <NavLink to="/creatorterms">Terms for Creators</NavLink>

          <NavLink to="/feedback">Feedback</NavLink>
        </div>
      </div>
      <div className="footer-bottom">&copy; Solario 2024</div>
    </div>
  );
};
export default Footer;
