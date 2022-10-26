import { Formik, ErrorMessage, Form } from "formik";
import Button from "react-bootstrap/Button";
import { getAuth, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { signinSchema } from "../validation/schemas";
import InputField from "../components/formik/inputField";
import Link from "next/link";

// Async function that is responsible for logging in users by connecting
// to Firebase
async function login(values) {
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
      alert("Please verify your email first");
      signOut(auth);
    }
  } catch (error) {
    console.log(error);
  }
}

function Login() {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={login}
      validationSchema={signinSchema}
    >
      <div className="form-container">
        <Form className="d-flex flex-column">
          <h3 className="form-header">Login</h3>

          <InputField type="email" name="email" placeholder="Email" />
          <ErrorMessage
            component="p"
            name="email"
            className="text-danger small mb-0"
          />

          <InputField type="password" name="password" placeholder="Password" />
          <ErrorMessage
            component="p"
            name="password"
            className="text-danger small mb-0"
          />

          <Button variant="primary" className="mt-3" type="submit">
            Login
          </Button>

          <h6 className="mt-3 text-center">
            <span className="me-1">Don&apos;t have an account?</span>
            <Link href="/register">Register</Link>
          </h6>
        </Form>
      </div>
    </Formik>
  );
}

export default Login;
