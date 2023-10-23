import React, { useState, useEffect } from "react";
import { axiosReq } from "../../../api/axiosDefaults";
import { toast } from "react-toastify";
import { Modal, Button, Container, Spinner } from "react-bootstrap";

const GroceryListComments = ({ listId }) => {
  const [comments, setComments] = useState();
  const [showDeleteItemPopup, setShowDeleteItemPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [commentToDelete, setCommentToDelete] = useState();

  const onCloseDeleteItemPopup = () => {
    setCommentToDelete(null);
    setShowDeleteItemPopup(false);
  };

  const loadComments = async () => {
    setIsLoading(true);
    const { data } = await axiosReq.get(`/grocerylistcomments/?list=${listId}`);
    setComments(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadComments();
  }, []);

  const deleteComment = async () => {
    try {
      await axiosReq.delete(`/grocerylistcomments/${commentToDelete.id}/`);
      setCommentToDelete(null);
      setShowDeleteItemPopup(false);
      loadComments();
      toast.success("Successfully deleted comment.");
    } catch {
      toast.error("Failed to delete the comment. Please try again.");
    }
  };

  const onClickDeleteComment = (comment) => {
    setCommentToDelete(comment);
    setShowDeleteItemPopup(true);
  };

  const confirmDeleteItemPopup = (
    <Modal show={showDeleteItemPopup} onHide={onCloseDeleteItemPopup}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Comment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete {commentToDelete?.content}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCloseDeleteItemPopup}>
          Cancel
        </Button>
        <Button variant="danger" onClick={deleteComment}>
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

  if (!comments || !comments.length) {
    return <p>There are no comments for the list yet.</p>;
  }

  return (
    <div className="d-flex flex-column mt-4">
      <h6 className="mb-3">Comments</h6>
      {comments.map((comment) => (
        <div className="mb-2">
          <div>
            <div className="font-weight-bold mb-1">{comment.creator}</div>
            <div className="d-flex justify-content-between">
              {comment.content}
              <Button
                variant="danger"
                onClick={() => onClickDeleteComment(comment)}
              >
                <i className="fas fa-trash-alt" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      {confirmDeleteItemPopup}
    </div>
  );
};

export default GroceryListComments;
