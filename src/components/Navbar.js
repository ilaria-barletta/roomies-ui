import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import { useCurrentUser } from "../contexts/CurrentUserContext";

const NavBar = () => {
  const currentUser = useCurrentUser();

  return (
    <Navbar>
      <Container>
        <NavLink to="/">
          <Navbar.Brand>Roomies</Navbar.Brand>
        </NavLink>
        <Navbar.Collapse className="justify-content-end">
          {currentUser && (
            <Navbar.Text>Signed in as: {currentUser.username}</Navbar.Text>
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
