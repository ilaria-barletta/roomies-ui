import React, { useState, useEffect, useCallback } from "react";
import { axiosReq } from "../../../api/axiosDefaults";
import { toast } from "react-toastify";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import GroceryItemFilterButton from "./GroceryItemFilterButton";
import styles from "../../../styles/GroceryListItems.module.css";

const GroceryListItems = ({ listId, householdId, isListComplete }) => {
  const [items, setItems] = useState();
  const [showDeleteItemPopup, setShowDeleteItemPopup] = useState(false);
  const [showItemStatusPopup, setShowItemStatusPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState();
  const [itemToChangeStatus, setItemToChangeStatus] = useState();
  const [filters, setFilters] = useState({ assignee: "", is_complete: "" });

  const onCloseDeleteItemPopup = () => {
    setItemToDelete(null);
    setShowDeleteItemPopup(false);
  };

  const onCloseChangeItemStatusPopup = () => {
    setItemToChangeStatus(null);
    setShowItemStatusPopup(false);
  };

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    const { assignee, is_complete } = filters;
    const { data } = await axiosReq.get(
      // Show is_complete items at the bottom
      `/groceryitems/?list=${listId}&assignee=${assignee}&is_complete=${is_complete}&ordering=is_complete`
    );
    setItems(data);
    setIsLoading(false);
  }, [filters, listId]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const deleteItem = async () => {
    try {
      await axiosReq.delete(`/groceryitems/${itemToDelete.id}/`);
      setItemToDelete(null);
      setShowDeleteItemPopup(false);
      loadItems();
      toast.success("Successfully deleted grocery item.");
    } catch {
      toast.error("Failed to delete grocery item. Please try again.");
    }
  };

  const toggleItemCompleted = async () => {
    // Copy the item data and change the value of the is_complete
    // field from true -> false or false -> true
    const itemData = {
      ...itemToChangeStatus,
      is_complete: !itemToChangeStatus.is_complete,
    };

    try {
      await axiosReq.put(`/groceryitems/${itemToChangeStatus.id}/`, itemData);
      setItemToChangeStatus(null);
      setShowItemStatusPopup(false);
      loadItems();
      toast.success("Successfully updated the grocery item status.");
    } catch {
      toast.error(
        "Failed to update the grocery item status. Please try again."
      );
    }
  };

  const onClickDeleteItem = (item) => {
    setItemToDelete(item);
    setShowDeleteItemPopup(true);
  };

  const showChangeItemStatusPopup = (item) => {
    setShowItemStatusPopup(true);
    setItemToChangeStatus(item);
  };

  const itemChangeStatusPopup = (
    <Modal show={showItemStatusPopup} onHide={onCloseChangeItemStatusPopup}>
      <Modal.Header closeButton>
        <Modal.Title>
          {itemToChangeStatus?.is_complete
            ? "Mark item as incomplete"
            : "Mark item as complete"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to{" "}
        {itemToChangeStatus?.is_complete ? "undo completing" : "complete"}{" "}
        {itemToChangeStatus?.name}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCloseChangeItemStatusPopup}>
          Cancel
        </Button>
        <Button variant="primary" onClick={toggleItemCompleted}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );

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

  const heading = (
    <div className="d-flex justify-content-between mb-3">
      <h6>Items</h6>
      <GroceryItemFilterButton
        householdId={householdId}
        filters={filters}
        onFiltersChanged={setFilters}
      />
    </div>
  );

  if (!items || !items.length) {
    return (
      <div className="d-flex flex-column mt-4">
        {heading}
        <p>There are no items in the list yet.</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column mt-4">
      {heading}
      {items.map((item) => (
        <div key={item.id} className="d-flex justify-content-between mb-2">
          <div>
            {item.is_complete && (
              <span>
                <span className={`${styles.Item} ${styles.Complete}`}>
                  <span className="text-dark">{item.name} </span>
                </span>

                <Badge variant="secondary" className="ml-2">
                  {item.assignee_name}
                </Badge>
              </span>
            )}
            {!item.is_complete && (
              <span>
                <span className={styles.Item}>{item.name} </span>
                <Badge variant="secondary" className="ml-2">
                  {item.assignee_name}
                </Badge>
              </span>
            )}
          </div>
          <DropdownButton
            variant="secondary"
            id="manage-item-button"
            title="Item Actions"
            disabled={isListComplete}
          >
            <Dropdown.Item onClick={() => showChangeItemStatusPopup(item)}>
              {item.is_complete ? "Mark as incomplete" : "Mark as complete"}
            </Dropdown.Item>
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
      {itemChangeStatusPopup}
    </div>
  );
};

export default GroceryListItems;
