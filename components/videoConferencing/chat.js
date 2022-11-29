import chatStyles from "./Chat.module.css";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { AiOutlineSend } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
// import {
//   useHMSActions,
//   useHMSStore,
//   selectHMSMessages,
// } from "@100mslive/react-sdk";
import { useState } from "react";

function Chat({ setChat }) {
  const [message, setMessage] = useState("");
  // const allMessages = useHMSStore(selectHMSMessages);
  // const hmsActions = useHMSActions();

  const allMessages = [{ message: "Dummy message", senderName: "You", id: 1 }];

  const handleClose = () => setChat(false);

  function sendMessage() {
    setMessage("");
    // hmsActions.sendBroadcastMessage(message);
  }

  return (
    <Card className={`${chatStyles["chat"]} bg-dark bg-gradient ms-4 ms-lg-0`}>
      <Card.Body>
        <Card.Title className="text-light">
          <Container>
            <Row xs="auto" className="justify-content-between">
              <Col className="p-0">Chat</Col>
              <Col className="p-0">
                <IoMdClose type="button" onClick={handleClose} />
              </Col>
            </Row>
          </Container>
          <hr className="bg-danger border-2 border-top " />
        </Card.Title>
        <Container
          className="mh-25 overflow-auto text-light"
          style={{ height: "200px" }}
        >
          {allMessages.length < 1 ? (
            <div className="d-flex justify-content-center align-items-center w-100 h-100">
              <p>Send a first message</p>
            </div>
          ) : (
            allMessages.map((msg) => (
              <p key={msg.id}>
                {msg.senderName}: {msg.message}
              </p>
            ))
          )}
        </Container>
        <Container className="p-1 bg-dark">
          <Row xs="auto" className="justify-content-around">
            <Col className="ps-2">
              <input
                type="text"
                className={`border-0 bg-transparent text-light ${chatStyles["no-outline"]}`}
                placeholder="Type something..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Col>
            <Col>
              <AiOutlineSend
                type="button"
                className="ms-1 text-light"
                onClick={sendMessage}
              />
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
}

export default Chat;
