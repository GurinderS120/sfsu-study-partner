import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { onlineSchema } from "../../validation/schemas";
import { Formik, ErrorMessage, Form } from "formik";
import InputField from "../formik/inputField";
import TimePicker from "react-time-picker/dist/entry.nostyle";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

function RoomStatus({
  date,
  contents,
  content,
  handleDayContent,
  invitees,
  setInvitees,
  setReviewInvitation,
}) {
  const [value, setValue] = useState("Private");
  const [time, setTime] = useState(
    content && content.startTime
      ? new Date(
          `${date.toLocaleDateString()} ${content.startTime}`
        ).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
  );
  const [endTime, setEndTime] = useState(
    content && content.endTime
      ? new Date(
          `${date.toLocaleDateString()} ${content.endTime}`
        ).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
  );

  function handleChange(e) {
    setValue(e.target.value);
  }

  function submitInfo(values) {
    const newTime = new Date(
      `${date.toLocaleDateString()} ${time}`
    ).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const newEndTime = new Date(
      `${date.toLocaleDateString()} ${endTime}`
    ).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const id = Math.floor(Math.random() * 10000) + 1;

    values.id = id;
    values.startTime = newTime;
    values.endTime = newEndTime;

    setInvitees((invitees) => {
      if (invitees.length === 10) {
        return invitees;
      }

      for (let invitee of invitees) {
        if (invitee.email === values.email) {
          return invitees;
        }
      }

      return [...invitees, values];
    });

    handleContent(newTime, newEndTime);
    setReviewInvitation(true);
  }

  function handleContent(newTime, newEndTime) {
    if (content) {
      if (
        newTime !== content.startTime ||
        newEndTime !== content.endTime ||
        invitees.length !== content.invitees.length
      ) {
        const data = {
          content: "Impromptu meeting",
          startTime: newTime,
          endTime: newEndTime,
          invitees: invitees,
        };

        handleDayContent(date.toDateString(), data);
      }
    } else {
      handleDayContent(date.toDateString(), {
        content: "Impromptu meeting",
        startTime: newTime,
        endTime: newEndTime,
        invitees: invitees,
      });
    }
  }

  return (
    <Container>
      <Card className="mt-3 mx-auto" style={{ maxWidth: "28rem" }}>
        <Card.Body>
          <Card.Title className="mb-4">Room Status</Card.Title>
          <hr />
          <Container>
            <Formik
              initialValues={{ email: "" }}
              onSubmit={submitInfo}
              validationSchema={onlineSchema}
            >
              <Form>
                <div className="d-flex flex-column">
                  <label className="mt-2 mb-2">
                    <span style={{ width: "4rem", display: "inline-block" }}>
                      Private
                    </span>
                    <input
                      type="radio"
                      value="Private"
                      className="ms-1"
                      checked={value === "Private"}
                      onChange={handleChange}
                    />
                  </label>

                  {value === "Private" && (
                    <>
                      <InputField
                        type="text"
                        name="email"
                        placeholder="Enter their email"
                      />
                      <ErrorMessage
                        component="p"
                        name="email"
                        className="text-danger small mb-0"
                      />

                      <p className="mt-2 mb-2">Invitation time:</p>
                      <Col className="mb-4">
                        <span>
                          <TimePicker
                            onChange={setTime}
                            value={time}
                            disableClock="true"
                            format="hh:mm a"
                            required
                          />
                        </span>
                        <span className="mx-2">to</span>
                        <span>
                          <TimePicker
                            onChange={setEndTime}
                            value={endTime}
                            disableClock="true"
                            format="hh:mm a"
                            required
                          />
                        </span>
                      </Col>
                    </>
                  )}

                  <Container className="mt-3">
                    <Row className="justify-content-start">
                      <Col xs="auto" className="ps-0">
                        <Button variant="primary" type="submit">
                          Review invitation
                        </Button>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </Form>
            </Formik>
          </Container>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RoomStatus;
