import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Container, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const GroceryItemForm = ({ listId, onItemAdded }) => {
  const history = useHistory();
  const [availableMembers, setAvailableMembers] = useState();
  const [loading, setIsLoading] = useState(true);
  const [itemData, setItemData] = useState({
    name: "",
    assignee: "",
    list: listId,
    is_complete: false,
  });
  const { name, assignee } = itemData;

  const handleChange = (event) => {
    setItemData({
      ...itemData,
      [event.target.name]: event.target.value,
    });
  };

  const loadList = async () => {
    const { data } = await axios.get(`/grocerylists/${listId}/`);
    return data;
  };

  const loadHousehold = async (list) => {
    const { data } = await axios.get(`/households/${list.household}/`);
    return data;
  };

  const loadAvailableMembersData = async () => {
    const list = await loadList();
    const household = await loadHousehold(list);

    // The user can choose the household members or creator
    // to assign to the grocery list item
    const members = household.members.concat([
      { user: household.creator_id, user_name: household.creator },
    ]);
    setAvailableMembers(members);
    setIsLoading(false);
  };

  const goBack = () => {
    // Found here: https://v5.reactrouter.com/web/api/history
    history.goBack();
  };

  useEffect(() => {
    loadAvailableMembersData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post("/groceryitems/", itemData);
    onItemAdded();
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

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
