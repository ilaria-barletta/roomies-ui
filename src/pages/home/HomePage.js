import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import axios from "axios";
import HouseholdDetails from "../../components/households/HouseholdDetails";

const HomePage = () => {
  const currentUser = useCurrentUser();
  const history = useHistory();
  const [households, setHouseHolds] = useState(null);

  useEffect(() => {
    // Redirect from this page if the user hasn't logged in
    if (!currentUser) {
      history.push("/signin");
    }
  }, [currentUser, history]);

  const loadHouseholds = async () => {
    const { data } = await axios.get("/households/");
    setHouseHolds(data);
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

  if (!households || !households.length) {
    return <>There are no household details to show.</>; // TODO: link to new household page here
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
