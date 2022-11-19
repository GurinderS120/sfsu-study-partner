import { useEffect, useState } from "react";
import { selectUser } from "../../reduxStateManagement/slices/userSlice";
import { useSelector } from "react-redux";
import Conference from "../../components/videoConferencing/conference";
import Container from "react-bootstrap/Container";
import CustomAlert from "../../components/alert";
import RoomStatus from "../../components/videoConferencing/roomStatus";

// import {
//   selectIsConnectedToRoom,
//   useHMSActions,
//   useHMSStore,
// } from "@100mslive/react-sdk";
import Spinner from "react-bootstrap/Spinner";

async function joinRoom(name, token, hmsActions) {
  //Join the room
  await hmsActions.join({
    userName: name,
    authToken: token,
  });
}

function StudyRoom() {
  const user = useSelector(selectUser);
  // const isConnected = useHMSStore(selectIsConnectedToRoom);
  const isConnected = true;
  const [isAlert, setIsAlert] = useState(false);
  const [variant, setVariant] = useState("warning");
  const [message, setMessage] = useState("message");
  // const hmsActions = useHMSActions();

  // useEffect(() => {
  //   // async function getUserToken() {
  //   //   //Retrieve user token (used in joining a room)
  //   //   const roomResponse = await fetch("/api/userToken", {
  //   //     method: "POST",
  //   //     headers: {
  //   //       "Content-Type": "application/json",
  //   //     },
  //   //     body: JSON.stringify({
  //   //       roomId: user.roomId,
  //   //       userId: user.uid,
  //   //     }),
  //   //   });
  //   //   const { token } = await roomResponse.json();
  //   //   joinRoom(user.name, token, hmsActions);
  //   // }
  //   // if (user) {
  //   //   getUserToken();
  //   // }
  // }, [user]);

  // useEffect(() => {
  //   window.onunload = () => {
  //     if (isConnected) {
  //       hmsActions.leave();
  //     }
  //   };
  // }, [hmsActions, isConnected]);

  return isConnected ? (
    <>
      {isAlert && (
        <CustomAlert
          variant={variant}
          message={message}
          setIsAlert={setIsAlert}
        />
      )}
      <Container fluid="md" className="section">
        <Conference setIsAlert={setIsAlert} setMessage={setMessage} />
        <RoomStatus />
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

export default StudyRoom;
