import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import axios from "axios";
import HouseholdDetails from "../../components/households/HouseholdDetails";

const HomePage = () => {
  const currentUser = useCurrentUser();
  const history = useHistory();
  const [households, setHouseHolds] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect from this page if the user hasn't logged in
    if (!currentUser) {
      history.push("/welcome");
    }
  }, [currentUser, history]);

  const loadHouseholds = async () => {
    const { data } = await axios.get("/households/");
    setHouseHolds(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (currentUser) {
      loadHouseholds();
    }
  }, [currentUser]);

  // Reload the list when a household is deleted
  const householdDeleted = () => {
    loadHouseholds();
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!households || !households.length) {
    return (
      <>
        <p className="mb-3">There are no household details to show.</p>
        <Link to="/newhousehold">
          <Button>New Household</Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <HouseholdDetails
        household={households[0]}
        householdDeleted={householdDeleted}
      />
      {households.length > 1 && (
        <Container className="mt-3">
          <Link to="/allhouseholds">View all your households</Link>
        </Container>
      )}
    </>
  );
};

export default HomePage;
