import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Container, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import useHouseholdMembers from "../../../hooks/useHouseholdMembers";

const GroceryItemForm = ({ listId, onItemAdded, existingItem }) => {
  const history = useHistory();
  const [householdId, setHouseholdId] = useState();
  const { isLoading: loading, members: availableMembers } =
    useHouseholdMembers(householdId);
  const [itemData, setItemData] = useState({
    name: existingItem?.name || "",
    assignee: existingItem?.assignee || "",
    list: listId,
    is_complete: false,
  });
  const { name, assignee } = itemData;

  const isEditing = !!existingItem;

  const handleChange = (event) => {
    setItemData({
      ...itemData,
      [event.target.name]: event.target.value,
    });
  };

  const loadList = async () => {
    const { data } = await axios.get(`/grocerylists/${listId}/`);
    setHouseholdId(data.household);
  };

  const goBack = () => {
    // Found here: https://v5.reactrouter.com/web/api/history
    history.goBack();
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // This component is used on the create and edit pages
    // this code makes it change the api to use depending
    // on if we are creating or editing
    if (isEditing) {
      await axios.put(`/groceryitems/${existingItem.id}/`, itemData);
    } else {
      await axios.post("/groceryitems/", itemData);
    }
    onItemAdded();
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  const title = isEditing ? (
    <h1>Edit grocery item</h1>
  ) : (
    <h1>Create a new grocery item</h1>
  );

  return (
    <Row>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className="p-4">
          {title}

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

            <Form.Group controlId="exampleForm.SelectCustom">
              <Form.Label>Assigned member</Form.Label>
              <Form.Control
                as="select"
                custom
                value={assignee}
                onChange={handleChange}
                name="assignee"
              >
                {availableMembers?.map((member) => (
                  <option value={member.user}>{member.user_name}</option>
                ))}
                <option value="">Select</option>
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">
              {isEditing ? "Update" : "Create"}
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
