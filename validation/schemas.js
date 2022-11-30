import * as yup from "yup";
const SUPPORTED_FILE_FORMATS = ["image/jpeg", "image/png"];

export const signupSchema = yup.object().shape({
  email: yup
    .string()
    .matches(/.*@mail[.]sfsu[.]edu/, {
      message: "Please enter a valid SFSU email",
    })
    .required("Required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/(.*[a-z])/, {
      message: "Password must contain at least one lowercase letter",
    })
    .matches(/(.*[A-Z])/, {
      message: "Password must contain at least one uppercase letter",
    })
    .matches(/(.*\d)/, {
      message: "Password must contain at least one number",
    })
    .required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

export const signinSchema = yup.object().shape({
  email: yup
    .string()
    .matches(/.*@mail[.]sfsu[.]edu/, {
      message: "Please enter a valid SFSU email",
    })
    .required("Required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/(.*[a-z])/, {
      message: "Password must contain at least one lowercase letter",
    })
    .matches(/(.*[A-Z])/, {
      message: "Password must contain at least one uppercase letter",
    })
    .matches(/(.*\d)/, {
      message: "Password must contain at least one number",
    })
    .required("Required"),
});

export const profileSchema = yup.object().shape({
  pic: yup
    .mixed()
    .required("Required")
    .test(
      "FILE_FORMAT",
      "Only jpg/jpeg, png image files are allowed",
      (value) => {
        return value && SUPPORTED_FILE_FORMATS.includes(value.type);
      }
    ),
  name: yup
    .string()
    .min(1, "Name must be at least 1 character long")
    .max(100, "Please enter a nickname")
    .matches(
      /^[\S]+(\s+[\S]+)*$/,
      "Please remove spaces from the beginning and end"
    )
    .required("Required"),
  major: yup
    .string()
    .min(2, "Major must be at least 1 character long")
    .required("Please enter your major")
    .matches(
      /^[\S]+(\s+[\S]+)*$/,
      "Please remove spaces from the beginning and end"
    ),
});

export const onlineSchema = yup.object().shape({
  email: yup
    .string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide valid email")
    .matches(
      /^[\S]+(\s+[\S]+)*$/,
      "Please remove spaces from the beginning and end"
    )
    .required("Required"),
});

export const inPersonSchema = yup.object().shape({
  email: yup
    .string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide valid email")
    .matches(
      /^[\S]+(\s+[\S]+)*$/,
      "Please remove spaces from the beginning and end"
    )
    .required("Required"),
  location: yup
    .string()
    .min(2, "Location must be at least 2 characters long")
    .max(100, "Please enter a shorter version of location")
    .matches(
      /^[\S]+(\s+[\S]+)*$/,
      "Please remove spaces from the beginning and end"
    )
    .required("Required"),
});

export const meetingSchema = yup.object().shape({
  description: yup
    .string()
    .min(2, "Description must be at least 2 characters long")
    .max(100, "Please try to be brief")
    .matches(
      /^[\S]+(\s+[\S]+)*$/,
      "Please remove spaces from the beginning and end"
    )
    .required("Required"),
});

export const studyRoomSchema = yup.object().shape({
  name: yup
    .string()
    .min(1, "Name must be at least 1 character long")
    .max(100, "Please enter a nickname")
    .matches(
      /^[\S]+(\s+[\S]+)*$/,
      "Please remove spaces from the beginning and end"
    )
    .required("Required"),
});

export const contactSchema = yup.object().shape({
  name: yup
    .string()
    .min(1, "Name must be at least 1 character long")
    .max(100, "Please enter a nickname")
    .matches(
      /^[\S]+(\s+[\S]+)*$/,
      "Please remove spaces from the beginning and end"
    )
    .required("Required"),
  email: yup
    .string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide valid email")
    .matches(
      /^[\S]+(\s+[\S]+)*$/,
      "Please remove spaces from the beginning and end"
    )
    .required("Required"),
  message: yup
    .string()
    .min(2, "Message must be at least 2 characters long")
    .max(200, "Please try to be brief")
    .matches(
      /^[\S]+(\s+[\S]+)*$/,
      "Please remove spaces from the beginning and end"
    )
    .required("Required"),
});
