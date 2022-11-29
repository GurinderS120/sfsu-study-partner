import {
  selectPeers,
  useHMSStore,
  selectLocalPeer,
} from "@100mslive/react-sdk";
import React from "react";
import Peer from "./peer";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import Chat from "./chat";
import FooterControls from "./footerControls";
import MidScreen from "./midScreen";
import ConfStyles from "./Conference.module.css";
import { BsChevronUp, BsChevronDown } from "react-icons/bs";
import { useRef } from "react";

function Conference({ setIsAlert, setMessage }) {
  const peersRef = useRef(null);
  const peers = useHMSStore(selectPeers);
  const localPeer = useHMSStore(selectLocalPeer);
  const [chat, setChat] = useState(true);
  // const localPeer = "dummy text";
  // const peers = [
  //   { id: 1, name: "Ahmed" },
  //   { id: 2, name: "Donnovan" },
  //   { id: 3, name: "Gurinder" },
  //   { id: 4, name: "Hira" },
  //   { id: 5, name: "Tung" },
  // ];

  return (
    <div className="bg-dark">
      <Row className="pt-5">
        <Col
          className={`${ConfStyles["participants-area"]} text-light ps-5`}
          xs
          md="auto"
          lg="3"
        >
          <BsChevronUp
            type="button"
            className={`${ConfStyles["chevron-icon"]} mx-auto`}
            onClick={() => (peersRef.current.scrollTop -= 125)}
          />

          <div
            ref={peersRef}
            className={`${ConfStyles["participants"]} overflow-auto mt-3 mb-2`}
          >
            {peers.map((peer) => (
              <Peer key={peer.id} peer={peer} />
            ))}
          </div>

          <BsChevronDown
            type="button"
            className={`${ConfStyles["chevron-icon"]} mx-auto`}
            onClick={() => (peersRef.current.scrollTop += 125)}
          />
        </Col>

        <Col xs="auto" sm={6} lg={6}>
          <MidScreen localPeer={localPeer} />
        </Col>

        <Col xs="auto" lg={3}>
          {chat && <Chat chat={chat} setChat={setChat} />}
        </Col>
      </Row>
      <Row>
        <FooterControls
          setChat={setChat}
          setIsAlert={setIsAlert}
          setMessage={setMessage}
        />
      </Row>
    </div>
  );
}

export default Conference;
