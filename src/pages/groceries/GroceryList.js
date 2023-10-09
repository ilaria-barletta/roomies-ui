import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import GroceryListDetails from "../../components/households/groceries/GroceryListDetails";

const GroceryList = () => {
  const [list, setList] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  const loadList = async () => {
    const { data } = await axios.get(`/grocerylists/${id}/`);
    setList(data);
    setIsLoading(false);
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

  return <GroceryListDetails list={list} />;
};

export default GroceryList;
