import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { Button, Container } from "react-bootstrap";
import HouseholdDetails from "../../components/households/HouseholdDetails";

const AllHouseholds = () => {
  const [households, setHouseHolds] = useState(null);
  const [currentHouseholdDetails, setCurrentHouseholdDetails] = useState(null);

  const loadHouseholds = async () => {
    const { data } = await axios.get("/households/");
    setHouseHolds(data);
  };

  useEffect(() => {
    loadHouseholds();
  }, []);

  const viewHouseholdDetails = (household) => {
    setCurrentHouseholdDetails(household);
  };

  const viewAllHouseholds = () => {
    setCurrentHouseholdDetails(null);
  };

  // Reload the list when a household is deleted
  const householdDeleted = () => {
    loadHouseholds();
    viewAllHouseholds();
  };

  if (!households || !households.length) {
    return <>There are no households to show.</>;
  }

  if (currentHouseholdDetails) {
    return (
      <>
        <HouseholdDetails
          household={currentHouseholdDetails}
          householdDeleted={householdDeleted}
        />
        <Container className="mt-3">
          <Button variant="link" onClick={viewAllHouseholds}>
            View all households
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>All Households</h1>
        <Link to="/newhousehold">
          <Button variant="primary">New Household</Button>
        </Link>
      </div>
      {households.map((household) => (
        <Card>
          <Card.Body>
            <Card.Title>{household.name}</Card.Title>
            <Button
              variant="primary"
              onClick={() => viewHouseholdDetails(household)}
            >
              View Details
            </Button>
          </Card.Body>
        </Card>
      ))}
    </>
  );
};

export default AllHouseholds;
