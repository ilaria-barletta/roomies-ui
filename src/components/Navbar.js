import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <Navbar>
      <Container>
        <NavLink to="/">
          <Navbar.Brand>Roomies</Navbar.Brand>
        </NavLink>
      </Container>
    </Navbar>
  );
};

export default NavBar;
