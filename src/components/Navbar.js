import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import { NavDropdown } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const history = useHistory();

  const signOut = async () => {
    try {
      await axios.post("/dj-rest-auth/logout/");
      setCurrentUser(null);
      toast.success("Successfully signed out.");
      history.push("/welcome");
    } catch {
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <NavLink to="/">
          <Navbar.Brand>Roomies</Navbar.Brand>
        </NavLink>
        <Navbar.Collapse className="justify-content-end">
          {currentUser && (
            <NavDropdown title={`Signed in as: ${currentUser.username}`}>
              <NavDropdown.Item onClick={signOut}>Sign out</NavDropdown.Item>
            </NavDropdown>
          )}
          {!currentUser && (
            <NavLink to="/signin">
              <Navbar.Text>Sign in</Navbar.Text>
            </NavLink>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
