import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import useHouseholdMembers from "../../../hooks/useHouseholdMembers";

const GroceryItemFilterButton = ({
  filters,
  onFiltersChanged,
  householdId,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { members } = useHouseholdMembers(householdId);
  const [assignee, setAssignee] = useState(filters.assignee || "");
  const [isComplete, setIsComplete] = useState(filters.is_complete || "");

  const onCloseModal = () => setShowModal(false);
  const onOpenModal = () => setShowModal(true);

  const onSaveFilters = () => {
    setShowModal(false);
    onFiltersChanged({ assignee, is_complete: isComplete });
  };

  const onAssigneeChange = (e) => {
    setAssignee(e.target.value);
  };

  const onIsCompleteChange = (e) => {
    setIsComplete(e.target.value);
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
                  key={member.user_name}
                />
              );
            })}
            <Form.Check
              label={"Anyone"}
              value={""}
              onChange={onAssigneeChange}
              checked={assignee === ""}
              type="radio"
            />
          </Form.Group>
          <Form.Group controlId="is_complete">
            <Form.Label>Status</Form.Label>
            <Form.Check
              label={"Completed"}
              value={"true"}
              onChange={onIsCompleteChange}
              checked={isComplete === "true"}
              type="radio"
            />
            <Form.Check
              label={"Not Completed"}
              value={"false"}
              onChange={onIsCompleteChange}
              checked={isComplete === "false"}
              type="radio"
            />
            <Form.Check
              label={"Any"}
              value={""}
              onChange={onIsCompleteChange}
              checked={isComplete === ""}
              type="radio"
            />
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
