import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const GroceryItemForm = ({ listId, onItemAdded }) => {
  const history = useHistory();
  const [itemData, setItemData] = useState({
    name: "",
    list: listId,
    is_complete: false,
  });
  const { name } = itemData;

  const handleChange = (event) => {
    setItemData({
      ...itemData,
      [event.target.name]: event.target.value,
    });
  };

  const goBack = () => {
    // Found here: https://v5.reactrouter.com/web/api/history
    history.goBack();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post("/groceryitems/", itemData);
    setItemData({
      ...itemData, // Keep the list ID after resetting the data
      name: "",
    });
    onItemAdded();
  };

  return (
    <Row>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className="p-4">
          <h1>Create a new grocery item</h1>

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

export default GroceryItemForm;
