import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Row, Col, Container, Form, Alert, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { axiosReq } from "../../../api/axiosDefaults";

const EditComment = () => {
  const { id: groceryListId, commentId } = useParams();
  const [commentData, setCommentData] = useState({
    content: "",
    list: groceryListId,
  });
  const [errors, setErrors] = useState({});
  const { content } = commentData;

  const history = useHistory();

  const loadComment = async () => {
    const { data } = await axiosReq.get(`/grocerylistcomments/${commentId}/`);
    setCommentData(data);
  };

  useEffect(() => {
    loadComment();
  }, []);

  const goBack = () => {
    // Found here: https://v5.reactrouter.com/web/api/history
    history.goBack();
  };

  const handleChange = (event) => {
    setCommentData({
      ...commentData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosReq.put(`/grocerylistcomments/${commentId}/`, commentData);
      toast.success("Successfully updated comment.");
      history.push(`/grocerylists/${groceryListId}`);
    } catch (err) {
      toast.error("Failed to update the comment. Please try again.");
      setErrors(err.response?.data);
    }
  };

  return (
    <Row>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className="p-4">
          <h1>Update comment</h1>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Content</Form.Label>
              <Form.Control
                type="text"
                placeholder="Content"
                name="content"
                value={content}
                onChange={handleChange}
              />
            </Form.Group>

            {errors.content?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </Container>

        <div className="mt-3">
          <Button onClick={goBack}>Back</Button>
        </div>
      </Col>
    </Row>
  );
};

export default EditComment;
