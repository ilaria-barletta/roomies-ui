import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Container, Spinner, Card, Button } from "react-bootstrap";

const GroceryLists = () => {
  const { id: householdId } = useParams();

  const [lists, setLists] = useState();
  const [isLoading, setIsLoading] = useState(true);

  // Get grocery lists for the household that aren't complete
  const loadGroceryLists = async () => {
    const { data } = await axios.get(
      `/grocerylists/?household=${householdId}&is_complete=false`
    );
    setLists(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadGroceryLists();
  }, []);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  // TODO: show the household name in the title
  if (lists && lists.length > 0) {
    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>Groceries ({lists[0].household_name})</h1>
        </div>
        {lists.map((list) => (
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{list.name}</Card.Title>
              <Link to={`/grocerylists/${list.id}`}>
                <Button variant="primary">View</Button>
              </Link>
            </Card.Body>
          </Card>
        ))}
      </>
    );
  }

  return <p>There are no grocery lists to show.</p>;
};

export default GroceryLists;
