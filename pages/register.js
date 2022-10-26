import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { Form, Formik, ErrorMessage } from "formik";
import { signupSchema } from "../validation/schemas";
import Button from "react-bootstrap/Button";
import InputField from "../components/formik/inputField";
import Link from "next/link";

async function register(values) {
  // Nextjs pre-renders the page using the node server, where the 'window' object
  // is not available as it is in the browser. Therefore, we import app in this
  // function because first app uses 'window' object and second the 'register' function
  // only get's called in the browser.
  const app = (await import("../firebase/config")).app;
  const auth = getAuth(app);

  try {
    const userInfo = await createUserWithEmailAndPassword(
      auth,
      values.email,
      values.password
    );
    await sendEmailVerification(userInfo.user);
    // We need to ensure that the user first verifies their password before
    // we let them sign in into our app. However, in firebase the user gets
    // signed in automatically when their account is created. So in order to
    // counter that behavior we logout the newly created user
    await signOut(auth);
  } catch (error) {
    console.log(error);
  }
}

function Register() {
  return (
    <Formik
      initialValues={{ email: "", password: "", confirmPassword: "" }}
      onSubmit={register}
      validationSchema={signupSchema}
    >
      <div className="form-container">
        <Form className="d-flex flex-column">
          <h3 className="form-header">Register</h3>

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

          <InputField
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
          />
          <ErrorMessage
            component="p"
            name="confirmPassword"
            className="text-danger small mb-0"
          />

          <Button variant="primary" className="mt-3" type="submit">
            Register
          </Button>

          <h6 className="mt-3 text-center">
            <span className="me-1">Already have an account?</span>
            <Link href="/login">Login</Link>
          </h6>
        </Form>
      </div>
    </Formik>
  );
}

export default Register;
