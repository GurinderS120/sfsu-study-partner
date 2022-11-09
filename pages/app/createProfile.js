import { Formik, ErrorMessage, Form } from "formik";
import Button from "react-bootstrap/Button";
import InputField from "../../components/formik/inputField";
import { profileSchema } from "../../validation/schemas";
import { AiOutlinePlus } from "react-icons/ai";
import { BiPencil } from "react-icons/bi";
import Image from "next/image";
import { useState, useRef } from "react";

function submitProfile(values) {
  console.log(values);
}

// This function is responsible for compressing and converting file into
// base64 encoded string which can be used as a url in src attribute of
// an image html tag
async function handleFileChange(file, setFieldValue, setImg) {
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
  const [img, setImg] = useState(null);
  const fileRef = useRef(null);

  return (
    <Formik
      initialValues={{ pic: "", name: "", major: "" }}
      onSubmit={submitProfile}
      validationSchema={profileSchema}
    >
      {(props) => (
        <div className="form-container">
          <Form className="d-flex flex-column">
            <h3 className="form-header">Create Profile</h3>
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
                  setImg
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
                  onClick={() => handleAddImage(fileRef)}
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

            {img && img.url && (
              <Image
                src={img.url}
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
