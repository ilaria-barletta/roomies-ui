import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Badge,
  DropdownButton,
  Dropdown,
  Modal,
  Button,
  Container,
  Spinner,
} from "react-bootstrap";

const GroceryListItems = ({ listId }) => {
  const [items, setItems] = useState();
  const [showDeleteItemPopup, setShowDeleteItemPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState();

  const onCloseDeleteItemPopup = () => {
    setItemToDelete(null);
    setShowDeleteItemPopup(false);
  };

  const loadItems = async () => {
    setIsLoading(true);
    const { data } = await axios.get(`/groceryitems/?list=${listId}`);
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const deleteItem = async () => {
    await axios.delete(`/groceryitems/${itemToDelete.id}/`);
    setItemToDelete(null);
    setShowDeleteItemPopup(false);
    loadItems();
  };

  const onClickDeleteItem = (item) => {
    setItemToDelete(item);
    setShowDeleteItemPopup(true);
  };

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

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <div className="d-flex flex-column mt-4">
      <h6>Items</h6>
      {items.map((item) => (
        <div className="d-flex justify-content-between mb-2">
          <div>
            {item.name} <Badge variant="secondary">{item.assignee_name}</Badge>
          </div>
          <DropdownButton
            variant="secondary"
            id="manage-item-button"
            title="Item Actions"
          >
            <Dropdown.Item
              href={`/grocerylists/${listId}/items/${item.id}/edit`}
            >
              Edit
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onClickDeleteItem(item)}>
              Delete
            </Dropdown.Item>
          </DropdownButton>
        </div>
      ))}

      {confirmDeleteItemPopup}
    </div>
  );
};

export default GroceryListItems;
