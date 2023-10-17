import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Form, Button, Col, Row, Container } from "react-bootstrap";
import axios from "axios";

const EditGroceryList = () => {
  const { id } = useParams();
  const [groceryListData, setGroceryListData] = useState({
    name: "",
    is_complete: false,
  });
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
    const { data } = await axios.get(`/grocerylists/${id}/`);
    setGroceryListData(data);
  };

  useEffect(() => {
    loadGroceryList();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.put(`/grocerylists/${id}/`, groceryListData);
      toast.success("Successfully updated the list.");
      history.push(`/grocerylists/${data.id}`);
    } catch (err) {
      toast.error("Failed to update the list. Please try again.");
      // TODO: Add errors to top of the form
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
