import React, { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";

import Badge from "react-bootstrap/Badge";

const Members = ({ creator, isOwner, householdId }) => {
  const [members, setMembers] = useState();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadMembers = async () => {
    const { data } = await axiosReq.get(`/households/${householdId}/members`);
    setMembers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadMembers();
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
      toast.success("Successfully deleted household member.");
    } catch {
      toast.error("Failed to delete household member. Please try again.");
    }
  };

  const clickDeleteMember = (member) => {
    setMemberToDelete(member);
    onShowDeletePopup();
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
      <div className="d-flex justify-content-between mb-3">
        <h4>Members</h4>
        <DropdownButton id="manage-members-button" title="Members Actions">
          <Dropdown.Item href={`/households/${householdId}/newmember`}>
            Add a new member
          </Dropdown.Item>
        </DropdownButton>
      </div>
      <div className="mb-1">
        {creator} <Badge variant="primary">Creator</Badge>
      </div>
      {members.map((member) => (
        <div className="d-flex justify-content-between mb-1">
          <div>
            {member.user_name} <Badge variant="secondary">Member</Badge>
          </div>
          {isOwner && (
            <Button
              aria-label={`Delete member ${member.user_name} button`}
              variant="danger"
              onClick={() => clickDeleteMember(member)}
            >
              <i className="fas fa-trash-alt" />
            </Button>
          )}
        </div>
      ))}

      {confirmDeletePopup}
    </>
  );
};

export default Members;
