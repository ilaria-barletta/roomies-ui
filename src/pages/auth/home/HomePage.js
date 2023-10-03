import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useCurrentUser } from "../../../contexts/CurrentUserContext";
import axios from "axios";
import HouseholdDetails from "../../../components/households/HouseholdDetails";

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

  if (!households || !households.length) {
    return <>There are no household details to show.</>;
  }

  return <HouseholdDetails household={households[0]} />;
};

export default HomePage;
