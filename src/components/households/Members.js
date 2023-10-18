import React, { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import { Button, Modal, Container, Spinner, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import Badge from "react-bootstrap/Badge";

const Members = ({ creator, isOwner, householdId }) => {
  const [members, setMembers] = useState();
  const [availableMembers, setAvailableMembers] = useState();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMemberToAdd, setNewMemberToAdd] = useState();

  const loadMembers = async () => {
    const { data } = await axiosReq.get(`/households/${householdId}/members`);
    setMembers(data);
    setIsLoading(false);
  };

  const loadAvailableMembers = async () => {
    const { data } = await axiosReq.get(
      `/households/${householdId}/availableusers`
    );
    setAvailableMembers(data);
  };

  useEffect(() => {
    loadMembers();
    loadAvailableMembers();
  }, []);

  const onCloseDeletePopup = () => {
    setShowDeletePopup(false);
    setMemberToDelete(null);
  };

  const onShowDeletePopup = () => setShowDeletePopup(true);

  const deleteMember = async () => {
    try {
      await axiosReq.delete(
        `/households/${householdId}/members/${memberToDelete.id}`
      );
      setShowDeletePopup(false);
      // Refresh the list after delete
      loadMembers();
      loadAvailableMembers();
      toast.success("Successfully deleted household member.");
    } catch {
      toast.error("Failed to delete household member. Please try again.");
    }
  };

  const clickDeleteMember = (member) => {
    setMemberToDelete(member);
    onShowDeletePopup();
  };

  const onNewMemberToAddSelected = (event) => {
    setNewMemberToAdd(event.target.value);
  };

  const onNewMemberFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosReq.post(`/households/${householdId}/members`, {
        user: newMemberToAdd,
      });
      loadMembers();
      loadAvailableMembers();
      setNewMemberToAdd("");
      toast.success("Successfully added new household member");
    } catch (err) {
      toast.error(
        "Failed to add the member to the household. Please try again."
      );
    }
  };

  const confirmDeletePopup = (
    <Modal show={showDeletePopup} onHide={onCloseDeletePopup}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete {memberToDelete?.user_name}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCloseDeletePopup}>
          Cancel
        </Button>
        <Button variant="danger" onClick={deleteMember}>
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
    <>
      <div className="mb-1">
        {creator} <Badge variant="primary">Creator</Badge>
      </div>
      {members.map((member) => (
        <div className="d-flex justify-content-between mb-1">
          <div>
            {member.user_name} <Badge variant="secondary">Member</Badge>
          </div>
          {isOwner && (
            <Button variant="danger" onClick={() => clickDeleteMember(member)}>
              <i className="fas fa-trash-alt" />
            </Button>
          )}
        </div>
      ))}

      <Container className="mt-3">
        <Form onSubmit={onNewMemberFormSubmit}>
          <Form.Group controlId="exampleForm.SelectCustom">
            <Form.Label>Add a new member</Form.Label>
            <Form.Control
              as="select"
              custom
              value={newMemberToAdd}
              onChange={onNewMemberToAddSelected}
            >
              {availableMembers?.map((member) => (
                <option value={member.id}>{member.username}</option>
              ))}
              <option value="">
                Please select the member you would like to add
              </option>
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit">
            Add
          </Button>
        </Form>
      </Container>

      {confirmDeletePopup}
    </>
  );
};

export default Members;
