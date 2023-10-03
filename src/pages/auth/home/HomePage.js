import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { useCurrentUser } from "../../../contexts/CurrentUserContext";

const HomePage = () => {
  const currentUser = useCurrentUser();
  const history = useHistory();

  useEffect(() => {
    // Redirect from this page if the user hasn't logged in
    if (!currentUser) {
      history.push("/signin");
    }
  }, [currentUser, history]);

  if (!currentUser) {
    return null;
  }

  return <>Home page</>;
};

export default HomePage;
