import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import { Form, Button, Col, Row, Container } from "react-bootstrap";
import axios from "axios";

const EditHouseholdForm = () => {
  const [householdData, setHouseholdData] = useState({
    name: "",
    rent: 0,
    rent_due_day: 1,
  });
  const { id } = useParams();
  const { name, rent, rent_due_day } = householdData;

  const history = useHistory();

  const loadHousehold = async () => {
    const { data } = await axios.get(`/households/${id}/`);
    setHouseholdData(data);
  };

  useEffect(() => {
    loadHousehold();
  }, []);

  const handleChange = (event) => {
    setHouseholdData({
      ...householdData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`/households/${id}/`, householdData);

      history.push("/allhouseholds");
    } catch (err) {
      // TODO: Add errors to top of the form
    }
  };

  return (
    <Row>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className="p-4">
          <h1>Edit household</h1>

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

            <Form.Group controlId="rent_due_day">
              <Form.Label>Rent Due Day</Form.Label>
              <Form.Control
                type="number"
                placeholder="Rent Due Day"
                name="rent_due_day"
                value={rent_due_day}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Edit
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

export default EditHouseholdForm;
