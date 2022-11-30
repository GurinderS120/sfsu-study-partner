import { getStorage, ref, uploadString } from "firebase/storage";

async function uploadImageToCloudStorage(pic) {
  const metaData = {
    contentType: pic.type,
  };

  const app = (await import("../firebase/config")).app;
  const storage = getStorage(app);
  const storageRef = ref(storage, pic.storageRef);

  try {
    await uploadString(storageRef, pic.url, "data_url", metaData);
  } catch (error) {
    // alert("error in uploadImageTo...");
  }
}

export default uploadImageToCloudStorage;
