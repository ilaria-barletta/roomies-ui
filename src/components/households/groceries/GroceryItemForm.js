import axios from "axios";
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const GroceryItemForm = ({ listId, onItemAdded }) => {
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
    <Form onSubmit={handleSubmit}>
      <div className="d-flex align-items-center">
        <Form.Group controlId="name" className="mb-0">
          <Form.Control
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="ml-1">
          Add
        </Button>
      </div>
    </Form>
  );
};

export default GroceryItemForm;
