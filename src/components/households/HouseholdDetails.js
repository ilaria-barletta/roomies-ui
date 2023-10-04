import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Members from "./Members";

const HouseholdDetails = ({ household }) => {
  // TODO: only show edit button if user is creator of household
  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h1>{household.name}</h1>
        <div>
          <Link to={`/households/${household.id}/edit`}>
            <Button variant="secondary">Edit Household</Button>
          </Link>
          <Link to="/newhousehold">
            <Button variant="primary">New Household</Button>
          </Link>
        </div>
      </div>
      <Accordion defaultActiveKey="0">
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              Members
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Members
                members={household.members}
                creator={household.creator}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="1">
              Rent
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body>
              <p>Rent amount: {household.rent}</p>
              <p>Rent due day: {household.rent_due_day}</p>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </>
  );
};

export default HouseholdDetails;
