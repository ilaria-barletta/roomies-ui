import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Badge,
  DropdownButton,
  Dropdown,
  Container,
  Spinner,
  Modal,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import GroceryListItems from "./GroceryListItems";

const GroceryListDetails = ({ list, onDeleteList }) => {
  const [showDeleteListPopup, setShowDeleteListPopup] = useState(false);

  const onCloseDeleteListPopup = () => {
    setShowDeleteListPopup(false);
  };

  const deleteList = async () => {
    await axios.delete(`/grocerylists/${list.id}/`);
    setShowDeleteListPopup(false);
    onDeleteList();
  };

  const onClickDeleteList = () => {
    setShowDeleteListPopup(true);
  };

  const confirmDeleteListPopup = (
    <Modal show={showDeleteListPopup} onHide={onCloseDeleteListPopup}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Grocery List</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete {list.name}?</Modal.Body>
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

  return (
    <>
      <div className="d-flex justify-content-between">
        <h4>{list.name}</h4>
        <DropdownButton id="manage-household-button" title="List Actions">
          <Dropdown.Item href={`/grocerylists/${list.id}/edit`}>
            Edit
          </Dropdown.Item>
          <Dropdown.Item onClick={onClickDeleteList}>Delete</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Header>Items</Dropdown.Header>
          <Dropdown.Item href={`/grocerylists/${list.id}/newitem`}>
            New Item
          </Dropdown.Item>
        </DropdownButton>
      </div>
      <h5>
        Created by: {list.creator} on {list.create_date}
      </h5>

      <Container className="mt-3">
        <GroceryListItems listId={list.id} />
      </Container>

      {confirmDeleteListPopup}
    </>
  );
};

export default GroceryListDetails;
