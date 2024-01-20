import { NavLink } from 'react-router-dom'
import './footer.css'
import Logo from './textBlack.png'

const Footer = () => {


  return (
    <div className="footer">
      <div className='footer-logo-wrapper'>
        <div className="footer-logo">
          <a href='/'><img src={Logo}  alt="Logo" className='footer-logo' /></a>
        </div>
        </div>
        <div className="footer-container">

              <NavLink to="/">Home</NavLink>

              <NavLink to="/blog">Blog</NavLink>

              <NavLink to="/app">Projects</NavLink>

              <NavLink to="/about">About</NavLink>
    
      </div>
    </div>
  )
}
export default Footer;