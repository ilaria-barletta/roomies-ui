import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import { Form, Button, Col, Row, Container } from "react-bootstrap";
import axios from "axios";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

const SignInForm = () => {
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = signInData;
  const setCurrentUser = useSetCurrentUser();
  const currentUser = useCurrentUser();

  const history = useHistory();

  useEffect(() => {
    // Go to the home page if the user has already logged in
    if (currentUser) {
      history.push("/");
    }
  }, [currentUser, history]);

  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);
      toast.success("Successfully signed in.");
      history.push("/");
    } catch (err) {
      toast.error("Failed to sign in. Please try again.");
      // TODO: Add errors to top of the form
    }
  };

  return (
    <Row>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className="p-4">
          <h1>Sign In</h1>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label className="d-none">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="password1">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Sign in
            </Button>
          </Form>
        </Container>

        <Container className="mt-3">
          <Link to="/signup">
            Don't have an account? <span>Sign up</span>
          </Link>
        </Container>
      </Col>
    </Row>
  );
};

export default SignInForm;
