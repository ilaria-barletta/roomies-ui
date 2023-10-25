import React, { useState, useEffect } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import { useParams, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";

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
    await axiosReq.delete(`/grocerylists/${listToDelete.id}/`);
    setShowDeleteListPopup(false);
    loadGroceryLists();
  };

  // Get all grocery lists for the household
  const loadGroceryLists = async () => {
    const { data } = await axiosReq.get(
      `/grocerylists/?household=${householdId}`
    );
    setLists(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadGroceryLists();
  }, []);

  const incompleteLists = () => lists?.filter((l) => !l.is_complete);
  const completeLists = () => lists?.filter((l) => l.is_complete);

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

  if (lists && lists.length > 0) {
    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>Groceries ({lists[0].household_name})</h1>
          <Link to={`/households/${householdId}/newgrocerylist`}>
            <Button variant="primary">New Grocery List</Button>
          </Link>
        </div>
        {incompleteLists().map((list) => (
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{list.name}</Card.Title>
              <Link to={`/grocerylists/${list.id}`} className="mr-1">
                <Button variant="primary">View List</Button>
              </Link>
              <Link to={`/grocerylists/${list.id}/edit`} className="mr-1">
                <Button variant="secondary">Edit Name</Button>
              </Link>

              <Button variant="danger" onClick={() => onClickDeleteList(list)}>
                <i className="fas fa-trash-alt" />
              </Button>
            </Card.Body>
          </Card>
        ))}
        {completeLists().length > 0 && <h4 className="mb-1">Completed</h4>}
        {completeLists().map((list) => (
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{list.name}</Card.Title>
              <Link to={`/grocerylists/${list.id}`} className="mr-1">
                <Button variant="primary">View List</Button>
              </Link>
              <Link to={`/grocerylists/${list.id}/edit`} className="mr-1">
                <Button variant="secondary">Edit Name</Button>
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
