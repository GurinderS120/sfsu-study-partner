import { useAVToggle } from "@100mslive/react-sdk";
import { FaMicrophoneAlt, FaMicrophoneAltSlash } from "react-icons/fa";
import { BsCameraVideo, BsCameraVideoOff, BsChatRight } from "react-icons/bs";
import { MdOutlineScreenShare, MdOutlineCallEnd } from "react-icons/md";
import { useHMSActions } from "@100mslive/react-sdk";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useRouter } from "next/router";

function FooterControls({ setChat, setIsAlert, setMessage }) {
  const { isLocalAudioEnabled, isLocalVideoEnabled, toggleAudio, toggleVideo } =
    useAVToggle();
  const hmsActions = useHMSActions();
  const router = useRouter();

  // const isLocalAudioEnabled = false;
  // const isLocalVideoEnabled = false;

  async function screenShare() {
    try {
      await hmsActions.setScreenShareEnabled(true);
    } catch (error) {
      // An error will be thrown if user didn't give access to share screen
      setMessage("You need to allow permission to share screen");
      setIsAlert(true);
    }
  }

  return (
    <>
      <Container className="p-3 mt-5">
        <Row xs="auto" className="justify-content-center">
          <Col>
            {isLocalAudioEnabled ? (
              <FaMicrophoneAlt
                className="rounded bg-light p-1"
                type="button"
                onClick={toggleAudio}
                size={30}
              />
            ) : (
              <FaMicrophoneAltSlash
                className="rounded bg-light p-1"
                type="button"
                onClick={toggleAudio}
                size={30}
              />
            )}
          </Col>

          <Col>
            {isLocalVideoEnabled ? (
              <BsCameraVideo
                className="rounded bg-light p-1"
                type="button"
                onClick={toggleVideo}
                size={30}
              />
            ) : (
              <BsCameraVideoOff
                className="rounded bg-light p-1"
                type="button"
                onClick={toggleVideo}
                size={30}
              />
            )}
          </Col>

          <Col>
            <MdOutlineScreenShare
              className="rounded bg-light p-1"
              type="button"
              onClick={screenShare}
              size={30}
            />
          </Col>

          <Col>
            <BsChatRight
              className="rounded bg-light p-1"
              type="button"
              onClick={() => setChat((chat) => !chat)}
              size={30}
            />
          </Col>

          <Col>
            <MdOutlineCallEnd
              className="rounded bg-danger bg-gradient p-1"
              type="button"
              onClick={() => {
                hmsActions.leave();
                router.push("/");
              }}
              size={30}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default FooterControls;
