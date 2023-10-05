import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import Members from "./Members";
import axios from "axios";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const HouseholdDetails = ({ household, householdDeleted }) => {
  const currentUser = useCurrentUser();
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const onCloseDeletePopup = () => setShowDeletePopup(false);

  const onShowDeletePopup = () => setShowDeletePopup(true);

  // Validate that the owner is the only one that can do household actions
  const isOwner = currentUser?.username === household.creator;

  const deleteHousehold = async () => {
    await axios.delete(`/households/${household.id}/`);
    setShowDeletePopup(false);
    householdDeleted();
  };

  const confirmDeletePopup = (
    <Modal show={showDeletePopup} onHide={onCloseDeletePopup}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Household</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete {household.name}?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCloseDeletePopup}>
          Cancel
        </Button>
        <Button variant="danger" onClick={deleteHousehold}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );

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

                <Dropdown.Item onClick={onShowDeletePopup}>
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
                isOwner={isOwner}
                householdId={household.id}
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
      {confirmDeletePopup}
    </>
  );
};

export default HouseholdDetails;
