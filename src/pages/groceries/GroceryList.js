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
    // Found here: https://v5.reactrouter.com/web/api/history
    history.goBack();
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
      <GroceryListDetails list={list} onDeleteList={goBack} />
      <div className="mt-5">
        <Button onClick={goBack}>Back</Button>
      </div>
    </>
  );
};

export default GroceryList;
