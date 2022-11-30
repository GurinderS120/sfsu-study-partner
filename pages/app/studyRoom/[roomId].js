import { useEffect, useState, useCallback } from "react";
import { selectUser } from "../../../reduxStateManagement/slices/userSlice";
import { useSelector } from "react-redux";
import Conference from "../../../components/videoConferencing/conference";
import Container from "react-bootstrap/Container";
import CustomAlert from "../../../components/alert";
import RoomStatus from "../../../components/videoConferencing/roomStatus";
import { useRouter } from "next/router";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { IoMdClose } from "react-icons/io";
import Button from "react-bootstrap/Button";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { Formik, ErrorMessage, Form } from "formik";
import InputField from "../../../components/formik/inputField";
import { studyRoomSchema } from "../../../validation/schemas";

import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import Spinner from "react-bootstrap/Spinner";

async function joinRoom(name, token, hmsActions, router) {
  //Join the room
  try {
    await hmsActions.join({
      userName: name,
      authToken: token,
    });
  } catch (err) {
    router.push("/login");
  }
}

function StudyRoom() {
  const user = useSelector(selectUser);
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  // const isConnected = true;
  const [isAlert, setIsAlert] = useState(false);
  const [variant, setVariant] = useState("warning");
  const [message, setMessage] = useState("message");
  const [invitees, setInvitees] = useState([]);
  const [contents, setContents] = useState(new Map());
  const [reviewInvitation, setReviewInvitation] = useState(false);
  const [date, setDate] = useState(new Date());
  const [guestUser, setGuestUser] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [waiting, setWaiting] = useState(false);
  const router = useRouter();
  const hmsActions = useHMSActions();

  useEffect(() => {
    const { roomId } = router.query;

    if (roomId === "null") {
      router.push("/app/createProfile");
    }

    setRoomId(roomId);

    if (!user && roomId !== "null") {
      setGuestUser(true);
    }
  }, [router, user]);

  useEffect(() => {
    async function getUserToken() {
      //Retrieve user token (used in joining a room)
      const roomResponse = await fetch("/api/userToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: user.roomId,
          userId: user.uid,
          role: "host",
        }),
      });
      const { token } = await roomResponse.json();
      joinRoom(user.name, token, hmsActions, router);
    }
    if (user && user.roomId) {
      getUserToken();
    }
  }, [user, hmsActions, router]);

  useEffect(() => {
    window.onunload = () => {
      if (isConnected) {
        hmsActions.leave();
      }
    };
  }, [hmsActions, isConnected]);

  // Fetch calendar contents from database
  useEffect(() => {
    async function getCalendarContent() {
      const app = (await import("../../../firebase/config")).app;
      const db = getFirestore(app);

      const docRef = doc(db, "impromptu-meetings", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let contents = docSnap.data();

        if (contents) {
          contents = new Map(Object.entries(contents));
          setContents(contents);
        }
      }
    }

    if (user?.uid) {
      getCalendarContent();
    }
  }, [user?.uid]);

  const saveContents = useCallback(
    async (invitation) => {
      // setUnsavedChanges(false);
      try {
        const app = (await import("../../../firebase/config")).app;
        const db = getFirestore(app);
        const data = Object.fromEntries(invitation);
        await setDoc(doc(db, "impromptu-meetings", user.uid), data);
      } catch (error) {}
    },
    [user?.uid]
  );

  async function getGuestToken(values) {
    //Retrieve user token (used in joining a room)
    const id = Math.floor(Math.random() * 10000) + 1;

    try {
      const roomResponse = await fetch("/api/userToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: roomId,
          userId: `${id}`,
          role: "guest",
        }),
      });
      const { token } = await roomResponse.json();
      setWaiting(true);
      joinRoom(values.name, token, hmsActions, router);
    } catch (err) {}
  }

  // Update contents
  const handleDayContent = (date, newContent) => {
    setContents((contents) => {
      const updatedContents = new Map(contents);

      if (newContent.content === "") {
        updatedContents.delete(date);
      } else {
        updatedContents.set(date, newContent);
      }

      return updatedContents;
    });
  };

  return (isConnected && user) || guestUser ? (
    waiting && !isConnected ? (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status" size="lg">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    ) : (
      <>
        {isAlert && (
          <CustomAlert
            variant={variant}
            message={message}
            setIsAlert={setIsAlert}
          />
        )}

        {guestUser && roomId && !isConnected ? (
          <Formik
            initialValues={{ name: "" }}
            onSubmit={getGuestToken}
            validationSchema={studyRoomSchema}
          >
            <div className="form-container">
              <Form className="d-flex flex-column">
                <h3 className="form-header">Enter your name</h3>
                <InputField type="text" name="name" placeholder="Name" />
                <ErrorMessage
                  component="p"
                  name="name"
                  className="text-danger small mb-0"
                />

                <Button variant="primary" className="mt-4" type="submit">
                  Join room
                </Button>
              </Form>
            </div>
          </Formik>
        ) : (
          <Container
            fluid="md"
            className={`section shadow-sm p-0 p-md-3 mb-5 rounded ${
              message && isAlert ? "mt-0" : ""
            }`}
          >
            <Conference setIsAlert={setIsAlert} setMessage={setMessage} />

            {!guestUser && (
              <>
                <RoomStatus
                  date={date}
                  contents={contents}
                  content={contents.get(date.toDateString())}
                  handleDayContent={handleDayContent}
                  invitees={invitees}
                  setInvitees={setInvitees}
                  setReviewInvitation={setReviewInvitation}
                />
                {reviewInvitation && (
                  <ReviewInvitation
                    date={date}
                    reviewInvitation={reviewInvitation}
                    setReviewInvitation={setReviewInvitation}
                    invitees={invitees}
                    setInvitees={setInvitees}
                    content={contents.get(date.toDateString())}
                    user={user}
                    contents={contents}
                    setMessage={setMessage}
                    setVariant={setVariant}
                    setIsAlert={setIsAlert}
                    handleDayContent={handleDayContent}
                    saveContents={saveContents}
                  />
                )}
              </>
            )}
          </Container>
        )}
      </>
    )
  ) : (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <Spinner animation="border" role="status" size="lg">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}

function ReviewInvitation({
  date,
  reviewInvitation,
  setReviewInvitation,
  invitees,
  setInvitees,
  content,
  user,
  contents,
  setMessage,
  setVariant,
  setIsAlert,
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
        } invited you to join them in a meeting held at their online study room at sfsu-study-partner website. Please review the details below: Invitation time: ${
          content.startTime
        } to ${content.endTime} \nLink: ${
          process.env.NODE_ENV === "development"
            ? `http://localhost:3000/app/studyRoom/${user.roomId}`
            : `https://sfsu-study-partner.vercel.app/${user.roomId}`
        }\n
        Thanks, \n sfsu-study-partner team`,

        to: invitees,

        subject: "Meeting invitation",
      }),
    });

    if (response.status === 200) {
      setMessage("Your invitation was sent successfully");
      setVariant("success");
      const updatedContents = new Map(contents);
      updatedContents.set(date.toDateString(), {
        content: "Impromptu meeting",
        startTime: content.startTime,
        endTime: content.endTime,
        mode: "Online",
        location: null,
        invitees: invitees,
      });

      saveContents(updatedContents);

      handleDayContent(date.toDateString(), {
        content: "Impromptu meeting",
        startTime: content.startTime,
        endTime: content.endTime,
        mode: "Online",
        location: null,
        invitees: invitees,
      });
    } else {
      setVariant("danger");
      setMessage("Your invitation wasn't sent, please try again later");
    }

    setIsAlert(true);
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
              <p className="mt-1 mb-2">Invitation time:</p>
              <div className="ps-2 bg-light">
                <span>{content.startTime}</span>
                <span className="mx-2">to</span>
                <span>{content.endTime}</span>
              </div>
            </Col>
          </Row>
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

export default StudyRoom;
