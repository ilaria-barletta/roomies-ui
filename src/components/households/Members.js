import React, { useState } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";

import Badge from "react-bootstrap/Badge";

const Members = ({ creator, members, isOwner, householdId }) => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const onCloseDeletePopup = () => {
    setShowDeletePopup(false);
    setMemberToDelete(null);
  };

  const onShowDeletePopup = () => setShowDeletePopup(true);

  const deleteMember = async () => {
    await axios.delete(
      `/households/${householdId}/members/${memberToDelete.id}`
    );
    setShowDeletePopup(false);
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

      {confirmDeletePopup}
    </>
  );
};

export default Members;
