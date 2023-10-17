import React, { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import { Button, Container } from "react-bootstrap";
import HouseholdDetails from "../../components/households/HouseholdDetails";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const AllHouseholds = () => {
  const [households, setHouseHolds] = useState(null);
  const [currentHouseholdDetails, setCurrentHouseholdDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useCurrentUser();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [householdToDelete, setHouseholdToDelete] = useState();

  const onCloseDeletePopup = () => {
    setShowDeletePopup(false);
    setHouseholdToDelete(null);
  };

  const onShowDeletePopup = (household) => {
    setShowDeletePopup(true);
    setHouseholdToDelete(household);
  };

  // Validate that the owner is the only one that can do household actions
  const isOwner = (household) => currentUser?.username === household.creator;

  const deleteHousehold = async () => {
    try {
      await axiosReq.delete(`/households/${householdToDelete.id}/`);
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
      <Modal.Body>
        Are you sure you want to delete {householdToDelete?.name}?
      </Modal.Body>
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

  const loadHouseholds = async () => {
    const { data } = await axiosReq.get("/households/");
    setHouseHolds(data);
    setIsLoading(false);
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

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

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
        <Card className="mb-3">
          <Card.Body>
            <Card.Title>{household.name}</Card.Title>
            <Button
              variant="primary"
              className="mr-1"
              onClick={() => viewHouseholdDetails(household)}
            >
              View Details
            </Button>
            {isOwner(household) && (
              <>
                <Link to={`/households/${household.id}/edit`} className="mr-1">
                  <Button variant="secondary">Edit</Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={() => onShowDeletePopup(household)}
                >
                  <i className="fas fa-trash-alt" />
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      ))}
      {confirmDeletePopup}
    </>
  );
};

export default AllHouseholds;
