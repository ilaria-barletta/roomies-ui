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
import GroceryItemForm from "./GroceryItemForm";

const GroceryListDetails = ({ list, onDeleteList }) => {
  const [items, setItems] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteItemPopup, setShowDeleteItemPopup] = useState(false);
  const [showDeleteListPopup, setShowDeleteListPopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState();

  const onCloseDeleteItemPopup = () => {
    setItemToDelete(null);
    setShowDeleteItemPopup(false);
  };

  const onCloseDeleteListPopup = () => {
    setShowDeleteListPopup(false);
  };

  const loadItems = async () => {
    setIsLoading(true);
    const { data } = await axios.get(`/groceryitems/?list=${list.id}`);
    setItems(data);
    setIsLoading(false);
  };

  const deleteItem = async () => {
    await axios.delete(`/groceryitems/${itemToDelete.id}/`);
    setItemToDelete(null);
    setShowDeleteItemPopup(false);
    loadItems();
  };

  const deleteList = async () => {
    await axios.delete(`/grocerylists/${list.id}/`);
    setShowDeleteListPopup(false);
    onDeleteList();
  };

  const onClickDeleteItem = (item) => {
    setItemToDelete(item);
    setShowDeleteItemPopup(true);
  };

  const onClickDeleteList = () => {
    setShowDeleteListPopup(true);
  };

  const onItemAdded = () => {
    loadItems();
  };

  useEffect(() => {
    loadItems();
  }, []);

  const confirmDeleteItemPopup = (
    <Modal show={showDeleteItemPopup} onHide={onCloseDeleteItemPopup}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Grocery Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete {itemToDelete?.name}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCloseDeleteItemPopup}>
          Cancel
        </Button>
        <Button variant="danger" onClick={deleteItem}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );

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
        </DropdownButton>
      </div>
      <h5>
        Created by: {list.creator} on {list.create_date}
      </h5>

      <Container className="mt-3">
        {isLoading && (
          <Container className="d-flex justify-content-center">
            <Spinner animation="border" variant="primary" />
          </Container>
        )}
        {!isLoading && !items?.length && <p>This list has no items.</p>}
        {!isLoading && items?.length && (
          <div className="d-flex flex-column mt-4">
            <h6>Items</h6>
            {items.map((item) => (
              <div className="d-flex justify-content-between mb-2">
                <div>
                  {item.name}{" "}
                  <Badge variant="secondary">{item.assignee_name}</Badge>
                </div>
                <DropdownButton
                  variant="secondary"
                  id="manage-item-button"
                  title="Item Actions"
                >
                  <Dropdown.Item>Edit</Dropdown.Item>
                  <Dropdown.Item onClick={() => onClickDeleteItem(item)}>
                    Delete
                  </Dropdown.Item>
                </DropdownButton>
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 d-flex align-items-center">
          <span className="mr-1">Add a new item</span>
          <GroceryItemForm listId={list.id} onItemAdded={onItemAdded} />
        </div>
      </Container>

      {confirmDeleteItemPopup}
      {confirmDeleteListPopup}
    </>
  );
};

export default GroceryListDetails;
