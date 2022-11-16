import { Formik, ErrorMessage, Form } from "formik";
import Button from "react-bootstrap/Button";
import InputField from "../../components/formik/inputField";
import { profileSchema } from "../../validation/schemas";
import { selectUser } from "../../reduxStateManagement/slices/userSlice";
import uploadImageToCloudStorage from "../../helperFunctions/uploadImageToCloud";
import uploadProfileToDatabase from "../../helperFunctions/uploadProfile";
import { useSelector } from "react-redux";
import PreviewImage from "../../components/previewImage";
import { updateUserProfile } from "../../reduxStateManagement/slices/userSlice";
import { useDispatch } from "react-redux";
import { AiOutlinePlus } from "react-icons/ai";
import { BiPencil } from "react-icons/bi";
import Image from "next/image";
import { useState, useRef } from "react";

// This function is responsible for compressing and converting file into
// base64 encoded string which can be used as a url in src attribute of
// an image html tag
async function handleFileChange(file, setFieldValue, setImg, setModal) {
  if (file && ["image/jpeg", "image/png"].includes(file.type)) {
    const options = {
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    const Compress = (await import("browser-image-compression")).default;
    const compressedImage = await Compress(file, options);

    const reader = new FileReader();
    reader.readAsDataURL(compressedImage);

    reader.onload = (e) => {
      setFieldValue("pic", { url: e.target.result, type: file.type });
      setImg({ url: e.target.result, type: file.type });
      setModal(true);
    };
  } else {
    setFieldValue("pic", { url: "", type: file.type });
    setImg(null);
  }
}

function handleAddImage(fileRef) {
  if (fileRef) {
    fileRef.current.click();
  }
}

function CreateProfile() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [img, setImg] = useState(null);
  const [modal, setModal] = useState(false);
  const fileRef = useRef(null);

  // We need to use a helper function because you can only use "UseSelector()"
  // in a react-component function. Moreover, "values" are passed by Formik so
  // they are not available in the "onSubmit" prop.
  const submitHandler = (values) => submitProfile(values, user);

  async function submitProfile(values, user) {
    if (user) {
      const imgStrgRef = `users/${
        user.uid
      }/userprofile/profileImg.${values.pic.type.replace("image/", "")}`;

      uploadImageToCloudStorage({
        url: values.pic.url,
        type: values.pic.type,
        storageRef: imgStrgRef,
      });

      const roomId = await uploadProfileToDatabase({
        values,
        user,
        imgStrgRef,
      });

      const { updateProfile, getAuth } = await import("firebase/auth");
      const app = (await import("../../firebase/config")).app;
      const auth = getAuth(app);

      updateProfile(auth.currentUser, {
        displayName: values.name,
        photoURL: imgStrgRef,
      });

      // Update the user object stored as global state
      dispatch(
        updateUserProfile({
          name: values.name,
          pic: imgStrgRef,
          roomId: roomId,
          major: values.major,
        })
      );
    } else {
      alert("Not logged in");
    }
  }

  return (
    <Formik
      initialValues={{ pic: "", name: "", major: "" }}
      onSubmit={submitHandler}
      validationSchema={profileSchema}
    >
      {(props) => (
        <div className="form-container">
          <Form className="d-flex flex-column">
            <h3 className="form-header">Create Profile</h3>

            {/* Once a user uploads an image we show the modal(popup), where they can edit that image using react-cropper */}
            {img && img.url && (
              <PreviewImage
                modal={modal}
                setModal={setModal}
                setFieldValue={props.setFieldValue}
                img={img}
              />
            )}

            {/* Pic input field */}
            <input
              ref={fileRef}
              name="pic"
              type="file"
              accept="image/png, image/jpeg"
              className={`${
                props.touched.pic
                  ? props.errors.pic
                    ? "is-invalid "
                    : "is-valid "
                  : ""
              }form-control mt-3 d-none`}
              onChange={(e) => {
                handleFileChange(
                  e.currentTarget.files[0],
                  props.setFieldValue,
                  setImg,
                  setModal
                );
              }}
            />

            {/* Add an image and Edit an image buttons */}
            <div className="d-flex flex-row justify-content-between">
              <AiOutlinePlus
                onClick={() => handleAddImage(fileRef)}
                className="bg-info p-2 rounded-circle text-white"
                size={40}
                type="button"
              />

              {img && img.url && (
                <BiPencil
                  onClick={() => setModal(true)}
                  className="bg-info p-2 rounded-circle text-white"
                  size={40}
                  type="button"
                />
              )}
            </div>

            <ErrorMessage
              component="p"
              name="pic"
              className="text-danger small mb-0"
            />

            {props.values.pic && props.values.pic.url && (
              <Image
                src={props.values.pic.url}
                className="rounded-circle"
                alt="User profile pic"
                width={300}
                height={300}
              />
            )}

            {/* Name input field */}
            <InputField type="text" name="name" placeholder="Name" />
            <ErrorMessage
              component="p"
              name="name"
              className="text-danger small mb-0"
            />

            {/* Major input field */}
            <InputField type="text" name="major" placeholder="Major" />
            <ErrorMessage
              component="p"
              name="major"
              className="text-danger small mb-0"
            />

            <Button variant="primary" className="mt-4" type="submit">
              Create Profile
            </Button>
          </Form>
        </div>
      )}
    </Formik>
  );
}

export default CreateProfile;
