import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import GroceryListDetails from "../../components/households/groceries/GroceryListDetails";

const GroceryList = () => {
  const [list, setList] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const history = useHistory();

  const loadList = async () => {
    const { data } = await axios.get(`/grocerylists/${id}/`);
    setList(data);
    setIsLoading(false);
  };

  const goBack = () => {
    history.push(`/households/${list.household}/groceries`);
  };

  useEffect(() => {
    loadList();
  }, [id]);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <>
      <GroceryListDetails list={list} onListChanged={goBack} />
      <div className="mt-5">
        <Button onClick={goBack}>Back</Button>
      </div>
    </>
  );
};

export default GroceryList;
