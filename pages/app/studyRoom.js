import { useEffect, useState } from "react";
import { selectUser } from "../../reduxStateManagement/slices/userSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

function StudyRoom() {
  const user = useSelector(selectUser);

  // useEffect(() => {
  //   async function getRoom() {
  //     console.log(user);
  //     //If the management token is expired or doesn't exist, fetch it
  //     const response = await fetch("/api/managementToken");
  //     const { token } = await response.json();

  //     //Once we have the management token we can use it to retrieve
  //     //user's room

  //     // console.log(`The roomId for ${user.name} is: ${id}`);

  //     //Once we have roomId we can join the room as host
  //   }

  //   console.log("In useEffect");
  //   if (user) {
  //     getRoom();
  //   }
  // }, [user?.name]);
  return <>{user?.roomId}</>;
}

export default StudyRoom;
