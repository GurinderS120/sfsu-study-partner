import React from "react";
import footerBarStyle from "./footerStyles.module.css";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function footerBar() {
  return (
    <Container className="bg-dark py-4" fluid>
      {/*  className={footerBarStyle["footer-links"]} */}
      <Row className="ms-2">
        {/* className={footerBarStyle["footer-link-wrapper"]} */}
        <Col className="text-light">
          {/* className={footerBarStyle["footer-link-items"]} */}
          <h2>Menu</h2>
          <Nav.Link className={footerBarStyle["text"]} href="/">
            Home
          </Nav.Link>
          <Nav.Link className={footerBarStyle["text"]} href="/">
            About
          </Nav.Link>
          <Nav.Link className={footerBarStyle["text"]} href="/">
            Product
          </Nav.Link>
        </Col>

        <Col className="text-light mb-2 mb-md-0">
          {/* className={footerBarStyle["footer-link-items"]} */}
          <h2>Services</h2>
          <Nav.Link className={footerBarStyle["text"]} href="/">
            Study Rooms
          </Nav.Link>
          <Nav.Link className={footerBarStyle["text"]} href="/">
            Scehdule Meeting
          </Nav.Link>
          <Nav.Link className={footerBarStyle["text"]} href="/">
            Invite Others
          </Nav.Link>
          <Nav.Link className="text" href="/">
            Create a Profile
          </Nav.Link>
        </Col>
        <Col className="text-light">
          {/* className={footerBarStyle["footer-link-items"]} */}
          <h2>Social Media</h2>
          <Nav.Link className={footerBarStyle["text"]} href="/">
            Facebook
          </Nav.Link>
          <Nav.Link className={footerBarStyle["text"]} href="/">
            Twitter
          </Nav.Link>
          <Nav.Link className={footerBarStyle["text"]} href="/">
            Instagram
          </Nav.Link>
        </Col>
        <Col className="text-light">
          {/* className={footerBarStyle["footer-link-items"]} */}
          <h2>Get In Touch</h2>
          <Nav.Link className={footerBarStyle["text"]} href="/">
            Email
          </Nav.Link>
          <Nav.Link className={footerBarStyle["text"]} href="/">
            415-000-000
          </Nav.Link>
          <Nav.Link className={footerBarStyle["text"]} href="/">
            LinkedIn
          </Nav.Link>
        </Col>
      </Row>
      <p className={`${footerBarStyle["website-rights"]} text-md-center`}>
        SFSU Study Partners est. 2022 © SFSU
      </p>
    </Container>
  );
}

export default footerBar;
