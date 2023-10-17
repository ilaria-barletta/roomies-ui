import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const WelcomePage = () => {
  const currentUser = useCurrentUser();
  const history = useHistory();

  useEffect(() => {
    // Go to the home page if the user has already logged in
    if (currentUser) {
      history.push("/");
    }
  }, [currentUser, history]);

  return (
    <>
      <h1 className="mb-3">Welcome to Roomies!</h1>
      <Link to="/signin" className="mr-1">
        <Button>Sign In</Button>
      </Link>
      <Link to="/signup">
        <Button>Sign Up</Button>
      </Link>
    </>
  );
};

export default WelcomePage;
