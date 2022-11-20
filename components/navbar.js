import NavStyles from "./Navbar.module.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { selectUser } from "../reduxStateManagement/slices/userSlice";
import { useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import Image from 'next/image'
import logo from '../public/SFSUSP4.png'

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
    <Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container fluid="md">
        <Navbar.Brand href="./pages/index.js"><Image src={logo} height={35} width={100}/></Navbar.Brand>
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
                <ProfileDropDown user={user} />
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

function ProfileDropDown({ user }) {
  return (
    <NavDropdown align="end">
      <NavDropdown.Item eventKey="4.1">
        <p>{`Welcome, ${user.name ? user.name : user.email}`}</p>
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item eventKey="4.2">Another action</NavDropdown.Item>
      <NavDropdown.Item eventKey="4.3">Something else here</NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item onClick={logout} eventKey="4.4">
        Logout
      </NavDropdown.Item>
    </NavDropdown>
  );
}

export default NavbarG;
