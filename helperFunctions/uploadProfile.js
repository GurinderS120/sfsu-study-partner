import { getFirestore, doc, setDoc } from "firebase/firestore";

// This function is responsible for connecting with Firebase's Cloud Firestore Database and submitting user profile
async function uploadProfileToDatabase(profInfo) {
  const { values, user, imgStrgRef } = profInfo;
  const app = (await import("../firebase/config")).app;
  const db = getFirestore(app);

  try {
    await setDoc(doc(db, "users", user.uid), {
      name: values.name,
      major: values.major,
      pic: {
        url: imgStrgRef,
      },
    });
  } catch (error) {
    alert(error.message);
  }
}

export default uploadProfileToDatabase;
