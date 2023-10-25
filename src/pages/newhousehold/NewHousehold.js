import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { axiosReq } from "../../api/axiosDefaults";

const NewHouseholdForm = () => {
  const [householdData, setHouseholdData] = useState({
    name: "",
    rent: 0,
    rent_due_day: 1,
  });
  const [errors, setErrors] = useState({});
  const { name, rent } = householdData;

  const history = useHistory();

  const handleChange = (event) => {
    setHouseholdData({
      ...householdData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosReq.post("/households/", householdData);
      toast.success("Successfully created a new household.");
      history.push("/allhouseholds");
    } catch (err) {
      toast.error("Failed to create the household. Please try again.");
      setErrors(err.response?.data);
    }
  };

  return (
    <Row>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className="p-4">
          <h1>Create a new household</h1>

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

            <Form.Group controlId="rent">
              <Form.Label>Rent</Form.Label>
              <Form.Control
                type="number"
                placeholder="Rent"
                name="rent"
                value={rent}
                onChange={handleChange}
              />
            </Form.Group>

            {errors.rent?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            <Button variant="primary" type="submit">
              Create
            </Button>
          </Form>
        </Container>

        <Container className="mt-3">
          <Link to="/">Back to home page</Link>
        </Container>
      </Col>
    </Row>
  );
};

export default NewHouseholdForm;
