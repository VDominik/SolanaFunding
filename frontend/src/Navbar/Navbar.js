import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import Logo from "../Footer/textBlack.png";
import Hamburger from "./hamburger.png";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNavbar &&
        !event.target.closest('.menu-icon') &&
        !event.target.closest('.nav-elements')
      ) {
        setShowNavbar(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showNavbar]);

  useEffect(() => {
    setShowNavbar(false);
  }, [location]);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };


  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <a href="/">
            <img src={Logo} alt="Logo" className="logo" />
          </a>
        </div>
        <div className="menu-icon" onClick={handleShowNavbar}>
        <img src={Hamburger} alt="Logo" className="logo" /> 
        </div>
        <div className={`nav-elements  ${showNavbar && "active"}`}>
          <ul>
            {/* <li>
              <NavLink to="/">Home</NavLink>
            </li> */}
            {/* <li>
              <NavLink to="/blog">Blog</NavLink>
            </li> */}
            <li>
              {/* <NavLink to="/app">Projects</NavLink> */} {/* Comented out because of the signup page */}
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              {/* <NavLink to="/profile">Profile</NavLink> */} {/* Comented out because of the signup page */}
            </li>
            <li className="campaign-button">
              <NavLink className={"create"} to="/waitlist">
                Sign Up Now
              </NavLink>
            </li>
            <li>
                {/* <div className="search-button"> */}
                  {/* <NavLink to="/app">Search</NavLink> */} {/* Comented out because of the signup page */}
                {/* </div> */}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
