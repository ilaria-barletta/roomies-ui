import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { axiosReq } from "../../api/axiosDefaults";

const EditGroceryList = () => {
  const { id } = useParams();
  const [groceryListData, setGroceryListData] = useState({
    name: "",
    is_complete: false,
  });
  const [errors, setErrors] = useState({});
  const { name } = groceryListData;

  const history = useHistory();

  const goBack = () => {
    // Found here: https://v5.reactrouter.com/web/api/history
    history.goBack();
  };

  const handleChange = (event) => {
    setGroceryListData({
      ...groceryListData,
      [event.target.name]: event.target.value,
    });
  };

  const loadGroceryList = async () => {
    const { data } = await axiosReq.get(`/grocerylists/${id}/`);
    setGroceryListData(data);
  };

  useEffect(() => {
    loadGroceryList();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosReq.put(
        `/grocerylists/${id}/`,
        groceryListData
      );
      toast.success("Successfully updated the list.");
      history.push(`/grocerylists/${data.id}`);
    } catch (err) {
      toast.error("Failed to update the list. Please try again.");
      setErrors(err.response?.data);
    }
  };

  return (
    <Row>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className="p-4">
          <h1>Edit Grocery List</h1>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                name="name"
                value={name}
                onChange={handleChange}
              />
            </Form.Group>

            {errors.name?.map((message, idx) => (
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

export default EditGroceryList;
