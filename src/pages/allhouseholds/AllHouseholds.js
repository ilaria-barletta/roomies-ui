import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";

const AllHouseholds = () => {
  const [households, setHouseHolds] = useState(null);

  const loadHouseholds = async () => {
    const { data } = await axios.get("/households/");
    setHouseHolds(data);
  };

  useEffect(() => {
    loadHouseholds();
  }, []);

  if (!households || !households.length) {
    return <>There are no households to show.</>;
  }

  return (
    <>
      {households.map((household) => (
        <Card>
          <Card.Body>
            <Card.Title>{household.name}</Card.Title>
            <Button variant="primary">View Details</Button>
          </Card.Body>
        </Card>
      ))}
    </>
  );
};

export default AllHouseholds;
