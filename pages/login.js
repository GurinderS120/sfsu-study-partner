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
import { selectUser } from "../reduxStateManagement/slices/userSlice";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import Spinner from "react-bootstrap/Spinner";
import { useEffect } from "react";

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
  const [redirect, setRedirect] = useState("");
  const user = useSelector(selectUser);
  const router = useRouter();

  // Async function that is responsible for logging in users by connecting
  // to Firebase
  async function login(values) {
    // Nextjs pre-renders the page using the node server, where the 'window' object
    // is not available as it is in the browser. Therefore, we import app in this
    // function because first app uses 'window' object and second the 'login' function only get's called in the browser.
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
      } else {
        if (userInfo.user.displayName) {
          setRedirect("studyRoom");
        } else {
          // Redirect the user to the create profile page
          setRedirect("createProfile");
        }
      }
    } catch (error) {
      setIsAlert(true);
      setVariant("danger");
      setMessage(error.message);
    }
  }

  useEffect(() => {
    if (redirect === "studyRoom" && user) {
      router.push(`/app/studyRoom/${user.roomId}`);
    } else if (redirect === "createProfile") {
      router.push("/app/createProfile");
    }
  }, [redirect, router, user]);

  function resetPassHelper(email, errors) {
    resetPassword(email, errors, setIsAlert, setVariant, setMessage);
  }

  return redirect ? (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <Spinner animation="border" role="status" size="lg">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  ) : (
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
        onSubmit={login}
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
