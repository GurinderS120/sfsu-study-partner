import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState, useCallback, useEffect } from "react";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import Calendar from "react-calendar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { selectUser } from "../../reduxStateManagement/slices/userSlice";
import Spinner from "react-bootstrap/Spinner";
import { useSelector } from "react-redux";
import { useLeavePageConfirm } from "../../customHooks/trackPageLeave";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import CustomAlert from "../../components/alert";
import Popover from "react-bootstrap/Popover";
import Card from "react-bootstrap/Card";
import { Formik, ErrorMessage, Form } from "formik";
import {
  onlineSchema,
  inPersonSchema,
  meetingSchema,
} from "../../validation/schemas";
import InputField from "../../components/formik/inputField";
import TimePicker from "react-time-picker/dist/entry.nostyle";
import { useRouter } from "next/router";
import { IoMdClose } from "react-icons/io";

function Meetings() {
  const [value, onChange] = useState(new Date());
  const [modal, setModal] = useState(false);
  const [isUpdateContent, setIsUpdateContent] = useState(false);
  const [date, setDate] = useState(new Date());
  const [contents, setContents] = useState(new Map());
  const [invitees, setInvitees] = useState([]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [reviewInvitation, setReviewInvitation] = useState(false);
  const [mode, setMode] = useState("Online");
  const [location, setLocation] = useState("");
  const [show, setShow] = useState(true);
  const [response, setResponse] = useState(null);
  const [isAlert, setIsAlert] = useState(false);
  const user = useSelector(selectUser);
  const router = useRouter();

  // Custom hook to prevent user from leaving the page with unsaved
  // changes
  useLeavePageConfirm(unsavedChanges);

  // useEffect(() => {
  //   if (router && !user) {
  //     router.push("/login");
  //   }
  // }, [router, user]);

  // Fetch calendar contents from database
  useEffect(() => {
    async function getCalendarContent() {
      const app = (await import("../../firebase/config")).app;
      const db = getFirestore(app);

      const docRef = doc(db, "calendar", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let contents = docSnap.data();

        if (contents) {
          contents = new Map(Object.entries(contents));
          setContents(contents);
        }
        setShow(true);
      }
    }

    if (user?.uid) {
      getCalendarContent();
    }
  }, [user?.uid]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [router, user]);

  const clickedDay = useCallback((date, event) => {
    setDate(date);
    setModal(true);
  }, []);

  // Update contents
  const handleDayContent = (date, newContent) => {
    setContents((contents) => {
      const updatedContents = new Map(contents);

      if (newContent.content === "") {
        updatedContents.delete(date);
      } else {
        updatedContents.set(date, newContent);
      }

      setIsUpdateContent((isUpdateContent) => !isUpdateContent);

      return updatedContents;
    });
  };

  // Update tile content
  const tileContent = useCallback(
    ({ date, view }) => {
      // Add content to tiles in month view only
      if (view === "month") {
        // Check if a date React-Calendar wants to check is on the list of dates to add content to
        const dateString = date.toDateString();

        if (contents.has(dateString)) {
          const content = contents.get(dateString);
          const popover = (
            <Popover id="popover-basic">
              <Popover.Header as="h3">Meeting details</Popover.Header>
              <Popover.Body>
                <p>{content.content}</p>
                <div>
                  <span>{content.startTime}</span>
                  <span className="mx-2">to</span>
                  <span>{content.endTime}</span>
                </div>
              </Popover.Body>
            </Popover>
          );

          return (
            <OverlayTrigger
              trigger="hover"
              placement="bottom"
              overlay={popover}
            >
              <div className="mt-2 text-truncate" style={{ maxWidth: "200" }}>
                {contents.get(dateString).content}
              </div>
            </OverlayTrigger>
          );
        }
      }
    },
    [isUpdateContent, contents]
  );

  // Save contents to database
  const saveContents = useCallback(
    async (invitation) => {
      setUnsavedChanges(false);
      try {
        const app = (await import("../../firebase/config")).app;
        const db = getFirestore(app);
        // const data = Object.fromEntries(updatedContents);
        await setDoc(doc(db, "calendar", user.uid), invitation);
      } catch (error) {}
    },
    [user?.uid]
  );

  // Update tile styles
  const tileClassName = useCallback(
    ({ date, view }) => {
      // Add class to tiles in month view only
      if (view === "month") {
        // Check if a date React-Calendar wants to check is on the list of dates to add class to
        const dateString = date.toDateString();

        if (contents.has(dateString)) {
          return "bg-light border border-1 calendar-border text-success";
        }
      }
    },
    [isUpdateContent, contents]
  );

  return user && show ? (
    <>
      {response && isAlert && (
        <CustomAlert
          variant={response === "successful" ? "success" : "danger"}
          message={
            response === "successful"
              ? "Your invitation was sent successfully"
              : "Your invitation wasn't sent, please try again later"
          }
          setIsAlert={setIsAlert}
        />
      )}

      <Container
        fluid="md"
        className={`section shadow-sm px-4 py-3 mb-5 rounded ${
          response && isAlert ? "mt-0" : ""
        }`}
      >
        {reviewInvitation && (
          <ReviewInvitation
            reviewInvitation={reviewInvitation}
            setReviewInvitation={setReviewInvitation}
            invitees={invitees}
            setInvitees={setInvitees}
            location={location}
            mode={mode}
            date={date}
            content={contents.get(date.toDateString())}
            user={user}
            contents={contents}
            setResponse={setResponse}
            setAlert={setIsAlert}
            handleDayContent={handleDayContent}
            saveContents={saveContents}
          />
        )}
        {modal && (
          <DateContent
            date={date}
            prevContents={contents.get(date.toDateString())}
            onContentChange={handleDayContent}
            modal={modal}
            setModal={setModal}
            contents={contents}
            saveContents={saveContents}
          />
        )}
        <Row>
          <Calendar
            onChange={onChange}
            value={value}
            tileContent={tileContent}
            tileClassName={tileClassName}
            onClickDay={clickedDay}
          />
        </Row>
        <Row>
          <MeetingLocation
            content={contents.get(date.toDateString())}
            invitees={invitees}
            setInvitees={setInvitees}
            setReviewInvitation={setReviewInvitation}
            mode={mode}
            setMode={setMode}
            setLocation={setLocation}
          />
        </Row>
      </Container>
    </>
  ) : (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <Spinner animation="border" role="status" size="lg">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}

function ReviewInvitation({
  reviewInvitation,
  setReviewInvitation,
  invitees,
  setInvitees,
  location,
  mode,
  date,
  content,
  user,
  contents,
  setResponse,
  setAlert,
  handleDayContent,
  saveContents,
}) {
  const handleClose = () => setReviewInvitation(false);

  const removeInvitee = (id) => {
    setInvitees((invitees) => {
      return invitees.filter((invitee) => invitee.id !== id);
    });
  };

  async function sendInvitation() {
    const response = await fetch("/api/sendEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Hi, your friend ${
          user.name
        } invited you to join them in a meeting held at ${
          mode === "Online"
            ? "their online study room at sfsu-study-partner website"
            : `${location}`
        }. Please review the details below: \n\nDate: ${date
          .toString()
          .substr(0, 3)} - ${date.toLocaleDateString()} \nDescription: ${
          content.content
        } \nTime: ${content.startTime} to ${content.endTime} \n${
          mode === "Online"
            ? `Link: http://localhost:3000/app/studyRoom/${user.roomId}\n`
            : ""
        }Thanks, \n sfsu-study-partner team`,

        to: invitees,

        subject: "Meeting invitation",
      }),
    });

    if (response.status === 200) {
      setResponse("successful");
      const updatedContents = new Map(contents);
      updatedContents.set(date.toDateString(), {
        content: content.content,
        startTime: content.startTime,
        endTime: content.endTime,
        mode: mode,
        location: location ? location : null,
        invitees: invitees,
      });

      saveContents(updatedContents);

      handleDayContent(date.toDateString(), {
        content: content.content,
        startTime: content.startTime,
        endTime: content.endTime,
        mode: mode,
        location: location ? location : null,
        invitees: invitees,
      });
    } else {
      setResponse("failed");
    }

    setAlert(true);
    handleClose();
  }

  return (
    <Modal
      show={reviewInvitation}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Invitation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container style={{ maxHeight: "25rem", overflowY: "auto" }}>
          <Row>
            <Col>
              <p className="mt-1 mb-2">Date:</p>
              <p className="ps-2 bg-light">
                {date.toString().substr(0, 3)} - {date.toLocaleDateString()}
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="mt-1 mb-2">Description:</p>
              <p className="ps-2 bg-light">{content.content}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="mt-1 mb-2">Time:</p>
              <div className="ps-2 bg-light">
                <span>{content.startTime}</span>
                <span className="mx-2">to</span>
                <span>{content.endTime}</span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="mt-3 mb-2">Mode:</p>
              <p className="ps-2 bg-light">{mode}</p>
            </Col>
          </Row>
          {mode === "In-person" && (
            <Row>
              <Col>
                <p className="mt-1 mb-2">Location:</p>
                <p className="ps-2 bg-light">{location}</p>
              </Col>
            </Row>
          )}
          <Row>
            <Col>
              <p className="mt-1 mb-2">Invite:</p>
              <div className="ms-sm-3">
                {invitees.map((invitee) => (
                  <div
                    className="px-sm-2 bg-light d-flex justify-content-between align-items-center mb-3 flex-wrap w-auto overflow-scroll"
                    key={invitee.id}
                  >
                    <span>{invitee.email}</span>
                    <IoMdClose
                      type="button"
                      onClick={() => removeInvitee(invitee.id)}
                    />
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Container>
          <Row className="justify-content-start">
            <Col xs="auto">
              <Button
                variant="primary"
                disabled={invitees.length < 1 ? "true" : ""}
                onClick={sendInvitation}
              >
                Send invitation
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal.Footer>
    </Modal>
  );
}

function MeetingLocation({
  content,
  invitees,
  setInvitees,
  setReviewInvitation,
  mode,
  setMode,
  setLocation,
}) {
  const [val, setVal] = useState({ email: "" });
  const [schema, setSchema] = useState(onlineSchema);

  function handleChange(e) {
    setMode(e.target.value);

    if (e.target.value === "Online") {
      setVal({ email: "" });
      setSchema(onlineSchema);
    } else {
      setVal({ email: "", location: "" });
      setSchema(inPersonSchema);
    }
  }

  function submitModeInfo(values) {
    const id = Math.floor(Math.random() * 10000) + 1;

    if (mode === "Online") {
      setMode("Online");
    } else {
      setMode("In-person");
      setLocation(values.location);
    }

    values.id = id;

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
    setReviewInvitation(true);
  }

  return (
    <Container>
      <Row>
        <Col>
          <Card
            className="mt-3 mx-auto"
            style={{
              maxWidth: "28rem",
              pointerEvents: content ? "auto" : "none",
            }}
          >
            <Card.Body>
              <Card.Title className="mb-4">Invite a friend</Card.Title>
              <hr />
              <Container>
                {!content ? (
                  <p className="mb-1 mt-2 text-danger">
                    Note: Please first select a date for meeting
                  </p>
                ) : invitees.length === 10 ? (
                  <p className="mb-1 mt-2 text-danger">
                    Note: You cannot invite anymore people
                  </p>
                ) : (
                  <p className="mb-1 mt-2 text-muted">
                    Note: You can only invite up to 10 people
                  </p>
                )}

                <Formik
                  initialValues={val}
                  onSubmit={submitModeInfo}
                  validationSchema={schema}
                >
                  <Form>
                    <div className="d-flex flex-column">
                      <label className="mt-2 mb-1">
                        <span
                          style={{ width: "6rem", display: "inline-block" }}
                        >
                          Online
                        </span>
                        <input
                          type="radio"
                          value="Online"
                          className="ms-1"
                          checked={mode === "Online"}
                          onChange={handleChange}
                        />
                      </label>

                      {mode === "Online" && (
                        <>
                          <InputField
                            type="email"
                            name="email"
                            placeholder="Enter their email"
                          />
                          <ErrorMessage
                            component="p"
                            name="email"
                            className="text-danger small mb-0"
                          />
                        </>
                      )}

                      <label className="mt-3 mb-1">
                        <span
                          style={{ width: "6rem", display: "inline-block" }}
                        >
                          In-person
                        </span>
                        <input
                          type="radio"
                          value="In-person"
                          className="ms-1"
                          checked={mode === "In-person"}
                          onChange={handleChange}
                        />
                      </label>

                      {mode === "In-person" && (
                        <>
                          <InputField
                            type="email"
                            name="email"
                            placeholder="Enter their email"
                          />
                          <ErrorMessage
                            component="p"
                            name="email"
                            className="text-danger small mb-0"
                          />

                          <InputField
                            type="text"
                            name="location"
                            placeholder="Location"
                          />
                          <ErrorMessage
                            component="p"
                            name="location"
                            className="text-danger small mb-0"
                          />
                        </>
                      )}

                      <Button
                        type="submit"
                        style={{ marginTop: "3.6rem" }}
                        disabled={content ? "" : "true"}
                        variant="primary"
                      >
                        Review invitation
                      </Button>
                    </div>
                  </Form>
                </Formik>
              </Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

function DateContent({
  date,
  prevContents,
  onContentChange,
  modal,
  setModal,
  contents,
  saveContents,
}) {
  const handleClose = () => setModal(false);

  const [time, setTime] = useState(
    prevContents && prevContents.startTime
      ? new Date(
          `${date.toLocaleDateString()} ${prevContents.startTime}`
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
    prevContents && prevContents.endTime
      ? new Date(
          `${date.toLocaleDateString()} ${prevContents.endTime}`
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

  const [mode, setMode] = useState(prevContents ? prevContents.mode : "");

  const [location, setLocation] = useState(
    prevContents && prevContents.location ? prevContents.location : ""
  );

  const [invitees, setInvitees] = useState(
    prevContents ? prevContents.invitees : ""
  );

  const removeInvitee = (id) => {
    setInvitees((invitees) => {
      return invitees.filter((invitee) => invitee.id !== id);
    });
  };

  function handleContent(values) {
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

    if (prevContents) {
      if (
        prevContents.content !== values.description ||
        newTime !== prevContents.startTime ||
        newEndTime !== prevContents.endTime ||
        mode !== prevContents.mode ||
        location !== prevContents.location ||
        invitees.length !== prevContents.invitees.length
      ) {
        const updatedContents = new Map(contents);
        const data = {
          content: values.description,
          startTime: newTime,
          endTime: newEndTime,
        };

        if (mode !== "") {
          data.mode = mode;
        }

        if (location !== "") {
          data.location = location;
        }

        if (invitees !== "") {
          data.invitees = invitees;
        }

        updatedContents.set(date.toDateString(), data);
        saveContents(updatedContents);

        onContentChange(date.toDateString(), data);
      }
    } else {
      const updatedContents = new Map(contents);
      updatedContents.set(date.toDateString(), {
        content: values.description,
        startTime: newTime,
        endTime: newEndTime,
      });
      saveContents(updatedContents);

      onContentChange(date.toDateString(), {
        content: values.description,
        startTime: newTime,
        endTime: newEndTime,
      });
    }
    handleClose();
  }

  function deleteContent() {
    const updatedContents = new Map(contents);
    updatedContents.delete(date.toDateString());
    saveContents(updatedContents);

    onContentChange(date.toDateString(), {
      content: "",
    });
    handleClose();
  }

  return (
    <Modal
      show={modal}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {date.toString().substr(0, 3)} - {date.toLocaleDateString()}
        </Modal.Title>
      </Modal.Header>
      <Container>
        <Formik
          initialValues={{
            description:
              prevContents && prevContents.content ? prevContents.content : "",
          }}
          onSubmit={handleContent}
          validationSchema={meetingSchema}
        >
          <Form>
            <Modal.Body>
              <Row>
                <Col>
                  <p className="mt-2 mb-2">Meeting description:</p>
                  <div style={{ maxWidth: "18rem" }}>
                    <InputField
                      type="text"
                      name="description"
                      placeholder="Description"
                    />
                  </div>
                  <ErrorMessage
                    component="p"
                    name="description"
                    className="text-danger small mb-0"
                  />
                </Col>
              </Row>

              <Row className="mt-2">
                <Col>
                  <p className="mt-2 mb-2">Pick a meeting time:</p>
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
              </Row>
              {mode && (
                <Row className="mt-2">
                  <Col>
                    <p className="mt-2 mb-1">Mode:</p>
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                      className="form-select"
                      style={{ maxWidth: "18rem" }}
                    >
                      <option value="Online">Online</option>
                      <option value="In-person">In-person</option>
                    </select>
                  </Col>
                </Row>
              )}
              {location && mode === "In-person" && (
                <Row className="mt-2">
                  <Col>
                    <p className="mt-2 mb-1">Location:</p>
                    <input
                      type="text"
                      value={location}
                      onChnage={(e) => setLocation(e.target.value)}
                    />
                  </Col>
                </Row>
              )}
              {invitees && (
                <Row>
                  <Col>
                    <p className="mt-2 mb-1">Invited:</p>
                    {invitees.map((invitee) => (
                      <div
                        className="px-sm-2 bg-light d-flex justify-content-between align-items-center mb-3 flex-wrap w-auto overflow-scroll"
                        key={invitee.id}
                      >
                        <span>{invitee.email}</span>
                        <IoMdClose
                          type="button"
                          onClick={() => removeInvitee(invitee.id)}
                        />
                      </div>
                    ))}
                  </Col>
                </Row>
              )}
            </Modal.Body>
            <Modal.Footer>
              {prevContents ? (
                <Container>
                  <Row className="justify-content-start">
                    <Col xs="auto" className="mb-2 ps-0 mb-sm-0">
                      <Button variant="primary" type="submit">
                        Update meeting
                      </Button>
                    </Col>
                    <Col xs="auto">
                      <Button variant="danger" onClick={deleteContent}>
                        Delete meeting
                      </Button>
                    </Col>
                  </Row>
                </Container>
              ) : (
                <Container>
                  <Row className="justify-content-start">
                    <Col xs="auto" className="ps-0">
                      <Button variant="primary" type="submit">
                        Add meeting
                      </Button>
                    </Col>
                  </Row>
                </Container>
              )}
            </Modal.Footer>
          </Form>
        </Formik>
      </Container>
    </Modal>
  );
}

export default Meetings;
