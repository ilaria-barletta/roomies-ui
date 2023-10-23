import React, { useState } from "react";
import { toast } from "react-toastify";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import Members from "./Members";
import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Groceries from "./groceries/Groceries";
import { Alert } from "react-bootstrap";
import Rent from "./rent/Rent";

const HouseholdDetails = ({
  household,
  householdDeleted,
  householdChanged,
}) => {
  const currentUser = useCurrentUser();
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const onCloseDeletePopup = () => setShowDeletePopup(false);

  const onShowDeletePopup = () => setShowDeletePopup(true);

  // Validate that the owner is the only one that can do household actions
  const isOwner = currentUser?.username === household.creator;
  const householdMember = household.members.find(
    (m) => m.user === currentUser?.pk
  );

  const deleteHousehold = async () => {
    try {
      await axiosReq.delete(`/households/${household.id}/`);
      setShowDeletePopup(false);
      toast.success("Successfully deleted the household.");
      householdDeleted();
    } catch {
      toast.error("Failed to delete the household. Please try again.");
    }
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

  const rentWarningBanner = () => {
    const banner = (
      <Alert variant="warning">
        Rent is due for this household. Please mark your rent as paid in the
        rent section below
      </Alert>
    );

    const creatorCollectionBanner = (
      <Alert variant="warning">
        Rent is due for this household. You have paid your share. Please remind
        household members to pay their rent. You can mark the rent as collected
        in the Rent section below once everyone has paid.
      </Alert>
    );

    if (!household.rent_is_due) {
      return null;
    }

    if (isOwner && !household.creator_has_paid_rent) {
      return banner;
    } else if (isOwner) {
      return creatorCollectionBanner;
    } else if (householdMember && !householdMember.has_paid_rent) {
      return banner;
    }

    return null;
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

                <Dropdown.Item onClick={onShowDeletePopup}>
                  Delete {household.name}
                </Dropdown.Item>
              </>
            )}
            <Dropdown.Divider />
            <Dropdown.Header>Groceries</Dropdown.Header>
            <Dropdown.Item href={`/households/${household.id}/newgrocerylist`}>
              New Grocery List
            </Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
      {rentWarningBanner()}
      <Accordion defaultActiveKey="0">
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              Members <i className="fas fa-users" />
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Members
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
              Rent <i className="fas fa-money-bill-alt" />
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body>
              <Rent household={household} householdChanged={householdChanged} />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="2">
              Groceries <i className="fas fa-shopping-basket" />
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="2">
            <Card.Body>
              <Groceries householdId={household.id} />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      {confirmDeletePopup}
    </>
  );
};

export default HouseholdDetails;
