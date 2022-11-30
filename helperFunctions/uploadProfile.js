import { getFirestore, doc, setDoc } from "firebase/firestore";

// This function is responsible for connecting with Firebase's Cloud Firestore Database and submitting user profile
async function uploadProfileToDatabase(profInfo) {
  const { values, user, imgStrgRef } = profInfo;
  const app = (await import("../firebase/config")).app;
  const db = getFirestore(app);

  try {
    const roomId = await createRoom(values.name);

    await setDoc(doc(db, "users", user.uid), {
      name: values.name,
      major: values.major,
      pic: {
        url: imgStrgRef,
      },
      roomId: roomId,
    });

    return roomId;
  } catch (error) {
    // alert(error.message);
  }
}

async function createRoom(name) {
  //If the management token is expired or doesn't exist, fetch it
  const response = await fetch("/api/managementToken");
  const { token } = await response.json();

  //Once we have the management token we can use it to create
  //user's room
  const roomResponse = await fetch("https://api.100ms.live/v2/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: `${name.replaceAll(" ", "-")}-room`,
      template_id: "6373e948e150dc0de7ce33dc",
      region: "us",
    }),
  });

  const { id } = await roomResponse.json();
  return id;
}

export default uploadProfileToDatabase;
