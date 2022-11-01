import NavStyles from "./Navbar.module.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { selectUser } from "../reduxStateManagement/slices/userSlice";
import { useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";

async function logout() {
  const app = (await import("../firebase/config")).app;
  const auth = getAuth(app);
  // Firebase Auth function to logout the user. This will in turn cause
  // the callback function defined using "onAuthStateChanged" listener
  // to run changing the global user state (logging the user out).
  signOut(auth);
}

function NavbarG() {
  const user = useSelector(selectUser);

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand href="/">Navbar</Navbar.Brand>
        <Navbar.Toggle
          className={NavStyles["nav-toggle-btn"]}
          aria-controls="offcanvasNavbar-expand-lg"
        />
        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-lg"
          aria-labelledby="offcanvasNavbarLabel-expand-lg"
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
              Navbar
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="mx-auto">
              <Nav.Link className="px-lg-4" href="/about">
                About
              </Nav.Link>
              <Nav.Link className="px-lg-4" href="/product">
                Product
              </Nav.Link>
              <Nav.Link className="px-lg-4" href="/contact">
                Contact
              </Nav.Link>
            </Nav>
            <Nav>
              {user ? (
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              ) : (
                <Nav.Link href="/login">Login</Nav.Link>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default NavbarG;
