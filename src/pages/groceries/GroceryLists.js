import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Container, Spinner, Card, Button, Modal } from "react-bootstrap";

const GroceryLists = () => {
  const { id: householdId } = useParams();

  const [lists, setLists] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteListPopup, setShowDeleteListPopup] = useState(false);
  const [listToDelete, setListToDelete] = useState();

  const onCloseDeleteListPopup = () => {
    setShowDeleteListPopup(false);
    setListToDelete(null);
  };

  const onClickDeleteList = (list) => {
    setListToDelete(list);
    setShowDeleteListPopup(true);
  };

  const deleteList = async () => {
    await axios.delete(`/grocerylists/${listToDelete.id}/`);
    setShowDeleteListPopup(false);
    loadGroceryLists();
  };

  // Get grocery lists for the household that aren't complete
  const loadGroceryLists = async () => {
    const { data } = await axios.get(
      `/grocerylists/?household=${householdId}&is_complete=false`
    );
    setLists(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadGroceryLists();
  }, []);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  const confirmDeleteListPopup = (
    <Modal show={showDeleteListPopup} onHide={onCloseDeleteListPopup}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Grocery List</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete {listToDelete?.name}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCloseDeleteListPopup}>
          Cancel
        </Button>
        <Button variant="danger" onClick={deleteList}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );

  // TODO: show the household name in the title
  if (lists && lists.length > 0) {
    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>Groceries ({lists[0].household_name})</h1>
          <Link to={`/households/${householdId}/newgrocerylist`}>
            <Button variant="primary">New Grocery List</Button>
          </Link>
        </div>
        {lists.map((list) => (
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{list.name}</Card.Title>
              <Link to={`/grocerylists/${list.id}`} className="mr-1">
                <Button variant="primary">View</Button>
              </Link>
              <Link to={`/grocerylists/${list.id}/edit`} className="mr-1">
                <Button variant="secondary">Edit</Button>
              </Link>

              <Button variant="danger" onClick={() => onClickDeleteList(list)}>
                <i className="fas fa-trash-alt" />
              </Button>
            </Card.Body>
          </Card>
        ))}
        {confirmDeleteListPopup}
      </>
    );
  }

  return <p>There are no grocery lists to show.</p>;
};

export default GroceryLists;
