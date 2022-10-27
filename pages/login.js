import { Formik, ErrorMessage, Form } from "formik";
import Button from "react-bootstrap/Button";
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { signinSchema } from "../validation/schemas";
import { useState } from "react";
import CustomAlert from "../components/alert";
import InputField from "../components/formik/inputField";
import Link from "next/link";

// Async function that is responsible for logging in users by connecting
// to Firebase
async function login(values, setIsAlert, setVariant, setMessage) {
  // Nextjs pre-renders the page using the node server, where the 'window' object
  // is not available as it is in the browser. Therefore, we import app in this
  // function because first app uses 'window' object and second the 'login' function
  // only get's called in the browser.
  const app = (await import("../firebase/config")).app;
  const auth = getAuth(app);

  try {
    const userInfo = await signInWithEmailAndPassword(
      auth,
      values.email,
      values.password
    );
    if (!userInfo.user.emailVerified) {
      setIsAlert(true);
      setVariant("warning");
      setMessage("Please verify your email first");
      signOut(auth);
    }
  } catch (error) {
    setIsAlert(true);
    setVariant("danger");
    setMessage(error.message);
  }
}

// Async function that is responsible for sending a password resetting email to
// users by connecting to Firebase
async function resetPassword(
  email,
  erorrs,
  setIsAlert,
  setVariant,
  setMessage
) {
  const app = (await import("../firebase/config")).app;
  const auth = getAuth(app);

  try {
    if (email === "" || erorrs) {
      setIsAlert(true);
      setVariant("danger");
      setMessage("Please provide valid SFSU email");
      return;
    }

    await sendPasswordResetEmail(auth, email);

    setIsAlert(true);
    setVariant("info");
    setMessage("Please check your SFSU email for resetting your password");
  } catch (error) {
    setIsAlert(true);
    setVariant("danger");
    setMessage(error.message);
  }
}

function Login() {
  const [isAlert, setIsAlert] = useState(false);
  const [variant, setVariant] = useState("info");
  const [message, setMessage] = useState("message");

  function loginHelper(values) {
    login(values, setIsAlert, setVariant, setMessage);
  }

  function resetPassHelper(email, errors) {
    resetPassword(email, errors, setIsAlert, setVariant, setMessage);
  }

  return (
    <>
      {isAlert && (
        <CustomAlert
          variant={variant}
          message={message}
          setIsAlert={setIsAlert}
        />
      )}

      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={loginHelper}
        validationSchema={signinSchema}
      >
        {(props) => (
          <div className="form-container">
            <Form className="d-flex flex-column">
              <h3 className="form-header">Login</h3>

              <InputField type="email" name="email" placeholder="Email" />
              <ErrorMessage
                component="p"
                name="email"
                className="text-danger small mb-0"
              />

              <InputField
                type="password"
                name="password"
                placeholder="Password"
              />
              <ErrorMessage
                component="p"
                name="password"
                className="text-danger small mb-0"
              />

              <p
                onClick={() =>
                  resetPassHelper(props.values.email, props.errors.email)
                }
                role="button"
                className="align-self-end small mt-1 mb-0 text-muted cursor"
              >
                Forgot/Reset password?
              </p>

              <Button variant="primary" className="mt-4" type="submit">
                Login
              </Button>

              <h6 className="mt-3 text-center">
                <span className="me-1">Don&apos;t have an account?</span>
                <Link href="/register">Register</Link>
              </h6>
            </Form>
          </div>
        )}
      </Formik>
    </>
  );
}

export default Login;
