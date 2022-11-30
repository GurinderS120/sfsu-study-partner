import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// import styles from "../styles/Home.module.css";

// This page is the default (home) page of our website, so it's served
// at the "/" endpoint
function Home() {
  const router = useRouter();
  const aboutRef = useRef(null);
  const productRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const { asPath } = router;

    switch (asPath.substring(2)) {
      case "about":
        aboutRef.current.scrollIntoView({ behavior: "smooth" });
        break;

      case "product":
        productRef.current.scrollIntoView({ behavior: "smooth" });
        break;

      case "contact":
        contactRef.current.scrollIntoView({ behavior: "smooth" });
        break;

      default:
        break;
    }
  }, [router]);

  return (
    <Container fluid = "md">
      <div>Index</div>
      <Row id="about" ref={aboutRef} style={{ marginBottom: "20rem" }}>
        <Col>
          img
        </Col>
        <Col>
        <h3>SFSU Study Partner</h3>
          <p>
          Do you study better when you have someone to study with? 

If the answer is yes, then you are at the right place. You can 

create your own study rooms, invite your friends or make 

them public for anyone to join.
          </p>
        </Col>
      </Row>
      {/* <div id="about" ref={aboutRef} style={{ marginBottom: "20rem" }}>
        About
      </div> */}
      <Row id="product" ref={productRef} style={{ marginBottom: "20rem" }}>
        <Row className ="justify-content-center mb-5"><h3 className ="text-center">Product</h3></Row>
        <Col>
        Create a Study Room
        </Col>
        <Col>
        Invite others
        </Col>
        <Col>
        Create a Profile
        </Col>
        <Col>
        Schedule a Study meeting
        </Col>
      </Row>
      <Row id="contact" ref={contactRef} style={{ marginBottom: "20rem" }}>
        <Col>
        <h3>Contact Us</h3>
          <p>
          Do you study better when you have someone to study with? 

If the answer is yes, then you are at the right place. You can 

create your own study rooms, invite your friends or make 

them public for anyone to join.
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;