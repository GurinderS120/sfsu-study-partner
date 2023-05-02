import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { contactSchema } from "../validation/schemas";
import { Formik, ErrorMessage, Form } from "formik";
import InputField from "../components/formik/inputField";
import TextAreaField from "../components/formik/textareaField";
import Button from "react-bootstrap/Button";
import study from "../public/SFSUSP.png";
import { SiGoogleclassroom } from "react-icons/si";
import { MdAttachEmail } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa";
import { BsFillCalendarWeekFill } from "react-icons/bs";

// This page is the default (home) page of our website, so it's served
// at the "/" endpoint
function Home() {
  const router = useRouter();
  const aboutRef = useRef(null);
  const productRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const { asPath } = router;

    const scrollProperties = {
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    };

    switch (asPath.substring(2)) {
      case "about":
        aboutRef.current.scrollIntoView(scrollProperties);
        break;

      case "product":
        productRef.current.scrollIntoView(scrollProperties);
        break;

      case "contact":
        contactRef.current.scrollIntoView(scrollProperties);
        break;

      default:
        break;
    }
  }, [router]);

  async function sendEmail(values, actions) {
    actions.resetForm();

    const response = await fetch("/api/sendEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `${values.name} with email: ${values.email} sent you the following message: \n${values.message}\nThanks,\nSFSU-study-partner team`,

        to: "sfsustudypartner@gmail.com",

        subject: "Contact message",
      }),
    });
  }

  return (
    <div className="pt-0 pt-lg-2">
      <Container fluid>
        <Row
          id="about"
          className="me-md-5"
          ref={aboutRef}
          style={{
            marginBottom: "10rem",
            scrollMarginTop: "100px",
            marginTop: "7rem",
          }}
        >
          <Col
            sm={5}
            md={5}
            className="text-center text-md-end pt-3 mb-5 mb-md-0 me-md-5"
          >
            <Image src={study} alt="Study Pic" height={100} width={200} />
          </Col>
          <Col sm={5} md={5} className="lh-lg pe-md-5">
            <h3>SFSU Study Partner</h3>
            <p>
              Do you study better when you have someone to study with? If the
              answer is yes, then you are at the right place. You can create
              your own study room, invite your friends, create your profile,
              schedule a study meeting.
            </p>
            <Button
              onClick={() => router.push("/login")}
              variant="primary"
              className="mt-4"
            >
              Get started
            </Button>
          </Col>
        </Row>
        <Row
          id="product"
          ref={productRef}
          className="text-center"
          style={{
            marginBottom: "10rem",
            backgroundColor: "#f1f5f8",
            scrollMarginTop: "50px",
            padding: "4rem 1rem",
          }}
        >
          <Row className="mb-5">
            <h3 className="text-center fw-bold">Product</h3>
          </Row>
          <Col sm={3}>
            <SiGoogleclassroom size={50} />
            <p className="mt-2">Create a Study Room</p>
          </Col>
          <Col sm={3}>
            <MdAttachEmail size={50} />
            <p className="mt-2">Invite others</p>
          </Col>
          <Col sm={3}>
            <FaUserCheck size={47} />
            <p className="mt-2">Create a Profile</p>
          </Col>
          <Col sm={3}>
            <BsFillCalendarWeekFill size={47} />
            <p className="mt-2">Schedule a Study meeting</p>
          </Col>
        </Row>
        <Row
          id="contact"
          className="justify-content-center"
          style={{ marginBottom: "5rem", scrollMarginTop: "100px" }}
        >
          <Col xs="auto">
            <h3 className="fw-bold mb-5 text-center">Contact Us</h3>
            <Formik
              initialValues={{ name: "", email: "", message: "" }}
              onSubmit={sendEmail}
              validationSchema={contactSchema}
            >
              <Form>
                <InputField type="text" name="name" placeholder="Name" />
                <ErrorMessage
                  component="p"
                  name="name"
                  className="text-danger small mb-0"
                />
                <InputField type="email" name="email" placeholder="Email" />
                <ErrorMessage
                  component="p"
                  name="email"
                  className="text-danger small mb-0"
                />
                <TextAreaField
                  type="text"
                  name="message"
                  placeholder="Message"
                />
                <ErrorMessage
                  component="p"
                  name="message"
                  className="text-danger small mb-0"
                />
                <Row className="w-100 mx-auto">
                  <Button variant="primary" className="mt-4" type="submit">
                    Send
                  </Button>
                </Row>
              </Form>
            </Formik>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
