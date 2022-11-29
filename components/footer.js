import React from "react";
import footerBarStyle from "./footerStyles.module.css";
import Nav from "react-bootstrap/Nav";


function footerBar() {
    return (
        <div className={footerBarStyle['footer-container']}>
        <div className={footerBarStyle['footer-links']}>
          <div className={footerBarStyle['footer-link-wrapper']}>
            <div className={footerBarStyle['footer-link-items']}>
              <h2>Menu</h2>
                <Nav.Link className = {footerBarStyle["text"]} href='/'>Home</Nav.Link>
                <Nav.Link className = "text" href='/'>About</Nav.Link>
                <Nav.Link className = "text" href='/'>Product</Nav.Link>
            </div>
          </div>
            <div className={footerBarStyle['footer-link-items']}>
              <h2>Services</h2>
              <Nav.Link className = "text" href='/'>Study Rooms</Nav.Link>
              <Nav.Link className = "text" href='/'>Scehdule Meeting</Nav.Link>
              <Nav.Link className = "text" href='/'>Invite Others</Nav.Link>
            </div>
            <div className={footerBarStyle['footer-link-items']}>
              <h2>Social Media</h2>
              <Nav.Link className = "text" href='/'>Facebook</Nav.Link>
              <Nav.Link className = "text" href='/'>Twitter</Nav.Link>
              <Nav.Link className = "text" href='/'>Instagram</Nav.Link>
            </div>
            <div className={footerBarStyle['footer-link-items']}>
              <h2>Get In Touch</h2>
              <Nav.Link className = "text" href='/'>Email</Nav.Link>
              <Nav.Link className = "text" href='/'>415-000-000</Nav.Link>
              <Nav.Link className = "text" href='/'>LinkedIn</Nav.Link>
            </div>
          </div>
          <small className={footerBarStyle['website-rights']}>SFSU Study Partners est. 2022 © SFSU</small>
         </div>
    );
}

export default footerBar;

