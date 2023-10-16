import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import useHouseholdMembers from "../../../hooks/useHouseholdMembers";

const GroceryItemFilterButton = ({
  filters,
  onFiltersChanged,
  householdId,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { members } = useHouseholdMembers(householdId);
  const [assignee, setAssignee] = useState(filters.assignee || "");

  const onCloseModal = () => setShowModal(false);
  const onOpenModal = () => setShowModal(true);

  const onSaveFilters = () => {
    setShowModal(false);
    onFiltersChanged({ assignee });
  };

  const onAssigneeChange = (e) => {
    setAssignee(e.target.value);
  };

  const filterPopup = (
    <Modal show={showModal} onHide={onCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Filters</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="assignee">
            <Form.Label>Assignee</Form.Label>
            {members.map((member) => {
              return (
                <Form.Check
                  label={member.user_name}
                  value={member.user}
                  onChange={onAssigneeChange}
                  checked={assignee === member.user.toString()}
                  type="radio"
                />
              );
            })}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCloseModal}>
          Close
        </Button>
        <Button variant="primary" onClick={onSaveFilters}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <>
      <Button variant="light" onClick={onOpenModal}>
        <i className="fas fa-filter" />
      </Button>
      {filterPopup}
    </>
  );
};

export default GroceryItemFilterButton;
