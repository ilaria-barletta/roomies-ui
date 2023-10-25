import { axiosReq } from "../../../api/axiosDefaults";
import React, { useState } from "react";
import { toast } from "react-toastify";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import GroceryListItems from "./GroceryListItems";
import GroceryListComments from "./GroceryListComments";

const GroceryListDetails = ({ list, onListChanged }) => {
  const [showDeleteListPopup, setShowDeleteListPopup] = useState(false);
  const [showChangeListStatusPopup, setShowChangeListStatusPopup] =
    useState(false);

  const onCloseDeleteListPopup = () => {
    setShowDeleteListPopup(false);
  };

  const deleteList = async () => {
    try {
      await axiosReq.delete(`/grocerylists/${list.id}/`);
      setShowDeleteListPopup(false);
      toast.success("Successfully deleted list.");
      onListChanged();
    } catch {
      toast.error("Failed to delete the list. Please try again.");
    }
  };

  const onClickDeleteList = () => {
    setShowDeleteListPopup(true);
  };

  const onCloseChangeListStatusPopup = () => {
    setShowChangeListStatusPopup(false);
  };

  const toggleListStatus = async () => {
    try {
      const listData = {
        ...list,
        is_complete: !list.is_complete,
      };
      await axiosReq.put(`/grocerylists/${list.id}/`, listData);
      toast.success("Successfully updated the list status.");
      setShowChangeListStatusPopup(false);
      onListChanged();
    } catch {
      toast.error("Failed to update the list status. Please try again.");
    }
  };

  const onClickChangeListStatus = () => {
    setShowChangeListStatusPopup(true);
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

  const changeListStatusPopup = (
    <Modal
      show={showChangeListStatusPopup}
      onHide={onCloseChangeListStatusPopup}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {list.is_complete
            ? "Mark list as incomplete"
            : "Mark list as complete"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to{" "}
          {list.is_complete ? "undo completing" : "complete"} {list.name}?
        </p>
        {list.is_complete && (
          <p>
            Move your list back to incomplete in order to perform actions on it
            and its items.
          </p>
        )}
        {!list.is_complete && (
          <p>
            You will not be able to modify the items on this list after
            completing the list.
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCloseChangeListStatusPopup}>
          Cancel
        </Button>
        <Button variant="primary" onClick={toggleListStatus}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <>
      <div className="d-flex justify-content-between">
        <h4>
          {list.name} {list.is_complete ? "(Completed)" : ""}
        </h4>
        <DropdownButton id="manage-household-button" title="List Actions">
          <Dropdown.Item onClick={onClickChangeListStatus}>
            {list.is_complete ? "Mark as incomplete" : "Mark as complete"}
          </Dropdown.Item>
          <Dropdown.Item href={`/grocerylists/${list.id}/edit`}>
            Edit
          </Dropdown.Item>
          <Dropdown.Item onClick={onClickDeleteList}>Delete</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Header>Items</Dropdown.Header>
          <Dropdown.Item
            href={`/grocerylists/${list.id}/newitem`}
            disabled={list.is_complete}
          >
            New Item
          </Dropdown.Item>
          <Dropdown.Header>Comments</Dropdown.Header>
          <Dropdown.Item href={`/grocerylists/${list.id}/newcomment`}>
            New Comment
          </Dropdown.Item>
        </DropdownButton>
      </div>
      <h5>
        Created by: {list.creator} on {list.create_date}
      </h5>

      {list.is_complete && (
        <Alert variant="warning">
          This list has been marked as complete. You can't add, remove, or edit
          items in completed lists.
        </Alert>
      )}

      <Container className="mt-3">
        <GroceryListItems
          listId={list.id}
          householdId={list.household}
          isListComplete={list.is_complete}
        />
      </Container>

      <Container className="mt-3">
        <GroceryListComments listId={list.id} />
      </Container>

      {confirmDeleteListPopup}
      {changeListStatusPopup}
    </>
  );
};

export default GroceryListDetails;
