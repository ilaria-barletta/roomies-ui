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

const GroceryListDetails = ({ list }) => {
  const [items, setItems] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState();

  const onCloseDeletePopup = () => {
    setItemToDelete(null);
    setShowDeletePopup(false);
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
    setShowDeletePopup(false);
    loadItems();
  };

  const onClickDeleteItem = (item) => {
    setItemToDelete(item);
    setShowDeletePopup(true);
  };

  const onItemAdded = () => {
    loadItems();
  };

  useEffect(() => {
    loadItems();
  }, []);

  const confirmDeleteItemPopup = (
    <Modal show={showDeletePopup} onHide={onCloseDeletePopup}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Grocery Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete {itemToDelete?.name}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCloseDeletePopup}>
          Cancel
        </Button>
        <Button variant="danger" onClick={deleteItem}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <>
      <h5>{list.name}</h5>
      <h6>
        Created by: {list.creator} on {list.create_date}
      </h6>

      <Container className="mt-3">
        {isLoading && (
          <Container className="d-flex justify-content-center">
            <Spinner animation="border" variant="primary" />
          </Container>
        )}
        {!isLoading && !items?.length && <p>This list has no items.</p>}
        {!isLoading && items?.length && (
          <div className="d-flex flex-column" style={{ gap: "8px" }}>
            {/** TODO: Fix inline style */}
            {items.map((item) => (
              <div className="d-flex justify-content-between">
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
    </>
  );
};

export default GroceryListDetails;
