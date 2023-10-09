import axios from "axios";
import React, { useEffect, useState } from "react";
import { Badge, Button, Container, Spinner } from "react-bootstrap";

const GroceryListDetails = ({ list }) => {
  const [items, setItems] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const loadItems = async () => {
    const { data } = await axios.get(`/groceryitems/?list=${list.id}`);
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <>
      <h5>{list.name}</h5>
      <h6>
        Created by: {list.creator} on {list.create_date}
      </h6>

      <Container className="mt-3">
        {isLoading && (
          <Container className="d-flex justify-content-center">
            <Spinner animation="border" variant="primary" />
          </Container>
        )}
        {!isLoading && !items?.length && <p>This list has no items.</p>}
        {!isLoading && items?.length && (
          <>
            {items.map((item) => (
              <div className="d-flex justify-content-between">
                <div>
                  {item.name}{" "}
                  <Badge variant="secondary">{item.assignee_name}</Badge>
                </div>
                <Button variant="danger">
                  <i className="fas fa-trash-alt" />
                </Button>
              </div>
            ))}
          </>
        )}
      </Container>
    </>
  );
};

export default GroceryListDetails;
