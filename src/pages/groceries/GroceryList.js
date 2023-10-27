import { axiosReq } from "../../api/axiosDefaults";
import React, { useEffect, useState, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import GroceryListDetails from "../../components/households/groceries/GroceryListDetails";

const GroceryList = () => {
  const [list, setList] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [hasFailed, setHasFailed] = useState(false);
  const { id } = useParams();
  const history = useHistory();

  const loadList = useCallback(async () => {
    try {
      const { data } = await axiosReq.get(`/grocerylists/${id}/`);
      setList(data);
      setIsLoading(false);
    } catch (err) {
      toast.error(
        `Failed to load the grocery list. Reason: ${err.response?.data?.detail}`
      );
      setHasFailed(true);
    }
  }, [id]);

  const goBack = () => {
    history.push(`/households/${list.household}/groceries`);
  };

  useEffect(() => {
    loadList();
  }, [loadList]);

  if (hasFailed) {
    return (
      <Container className="d-flex justify-content-center">
        Something went wrong trying to load this grocery list...
      </Container>
    );
  }

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
