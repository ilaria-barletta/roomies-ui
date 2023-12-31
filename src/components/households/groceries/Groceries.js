import React, { useEffect, useState, useCallback } from "react";
import { axiosReq } from "../../../api/axiosDefaults";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import GroceryListDetails from "./GroceryListDetails";
import { Link } from "react-router-dom";

const Groceries = ({ householdId }) => {
  const [lists, setLists] = useState();
  const [isLoading, setIsLoading] = useState(true);

  // Get grocery lists for the household that aren't complete
  const loadGroceryLists = useCallback(async () => {
    setIsLoading(true);
    const { data } = await axiosReq.get(
      `/grocerylists/?household=${householdId}&is_complete=false`
    );
    setLists(data);
    setIsLoading(false);
  }, [householdId]);

  useEffect(() => {
    loadGroceryLists();
  }, [loadGroceryLists]);

  const onListChanged = () => {
    loadGroceryLists();
  };

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
        <GroceryListDetails list={listToShow} onListChanged={onListChanged} />
        <Container className="mt-3">
          <Link to={`/households/${householdId}/groceries`}>
            <Button variant="link">
              View all grocery lists for this household
            </Button>
          </Link>
        </Container>
      </>
    );
  }

  return <p>There are no grocery lists to show.</p>;
};

export default Groceries;
