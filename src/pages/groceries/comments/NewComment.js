import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { toast } from "react-toastify";
import { axiosReq } from "../../../api/axiosDefaults";

const NewComment = () => {
  const { id: listId } = useParams();
  const [commentData, setCommentData] = useState({
    content: "",
    list: listId,
  });
  const [errors, setErrors] = useState({});
  const { content } = commentData;

  const history = useHistory();

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
      const { data } = await axiosReq.post(
        "/grocerylistcomments/",
        commentData
      );
      toast.success("Successfully created comment.");
      history.push(`/grocerylists/${data.list}`);
    } catch (err) {
      toast.error("Failed to create the comment. Please try again.");
      setErrors(err.response?.data);
    }
  };

  return (
    <Row>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className="p-4">
          <h1>Create a new comment</h1>

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
              Create
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

export default NewComment;
