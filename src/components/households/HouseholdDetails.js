import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { useHistory } from "react-router-dom";
import Members from "./Members";
import axios from "axios";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const HouseholdDetails = ({ household }) => {
  const history = useHistory();
  const currentUser = useCurrentUser();

  // Validate that the owner is the only one that can do household actions
  const isOwner = currentUser?.username === household.creator;

  const deleteHousehold = async () => {
    await axios.delete(`/households/${household.id}/`);
    history.push("/");
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h1>{household.name}</h1>

        <div className="d-flex">
          <DropdownButton
            id="manage-household-button"
            title="Household Actions"
          >
            <Dropdown.Item href="/newhousehold">New Household</Dropdown.Item>
            {isOwner && (
              <>
                <Dropdown.Item href={`/households/${household.id}/edit`}>
                  Edit {household.name}
                </Dropdown.Item>

                <Dropdown.Item onClick={deleteHousehold}>
                  Delete {household.name}
                </Dropdown.Item>
              </>
            )}
          </DropdownButton>
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
