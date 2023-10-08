import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Spinner } from "react-bootstrap";

const Groceries = ({ householdId }) => {
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

  if (lists && lists.length > 0) {
    const listToShow = lists[0];
    return (
      <>
        <h5>{listToShow.name}</h5>
        <h6>
          Created by: {listToShow.creator} on {listToShow.create_date}
        </h6>
      </>
    );
  }

  return <p>There are no grocery lists to show.</p>;
};

export default Groceries;
