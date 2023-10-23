import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import logo from "./logo.png";
import styles from "../../styles/WelcomePage.module.css";

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
      <h1 className="mb-3 text-center">Roomies</h1>
      <div className="mb-3 d-flex justify-content-center">
        <img src={logo} alt="Roomies logo" className={styles.WelcomeImage} />
      </div>
      <p className="mb-3">
        Manage your households in an easy way! Add roomies, create grocery lists
        and track your rent payments all in one place. They say sharing isn't
        easy..we say it doesn't have to be hard
      </p>
      <div className="d-flex justify-content-center">
        <Link to="/signin" className="mr-1">
          <Button>Sign In</Button>
        </Link>
        <Link to="/signup">
          <Button>Sign Up</Button>
        </Link>
      </div>
    </>
  );
};

export default WelcomePage;
