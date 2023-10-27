import { axiosReq } from "../../../api/axiosDefaults";
import React, { useState, useEffect, useCallback } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import useHouseholdMembers from "../../../hooks/useHouseholdMembers";

const GroceryItemForm = ({ listId, onItemAdded, existingItem }) => {
  const history = useHistory();
  const [householdId, setHouseholdId] = useState();
  const [errors, setErrors] = useState({});
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

  const loadList = useCallback(async () => {
    const { data } = await axiosReq.get(`/grocerylists/${listId}/`);
    setHouseholdId(data.household);
  }, [listId]);

  const goBack = () => {
    // Found here: https://v5.reactrouter.com/web/api/history
    history.goBack();
  };

  useEffect(() => {
    loadList();
  }, [loadList]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // This component is used on the create and edit pages
    // this code makes it change the api to use depending
    // on if we are creating or editing
    if (isEditing) {
      try {
        await axiosReq.put(`/groceryitems/${existingItem.id}/`, itemData);
        toast.success("Successfully updated the grocery list item.");
        onItemAdded();
      } catch (err) {
        toast.error(
          "Failed to update the grocery list item. Please try again."
        );
        setErrors(err.response?.data);
      }
    } else {
      try {
        await axiosReq.post("/groceryitems/", itemData);
        toast.success("Successfully created the grocery list item.");
        onItemAdded();
      } catch (err) {
        toast.error(
          "Failed to create the grocery list item. Please try again."
        );
        setErrors(err.response?.data);
      }
    }
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

            {errors.name?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

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
                  <option key={member.user_name} value={member.user}>
                    {member.user_name}
                  </option>
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
