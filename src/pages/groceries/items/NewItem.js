import React from "react";
import { useParams, useHistory } from "react-router-dom";
import GroceryItemForm from "../../../components/households/groceries/GroceryItemForm";

const NewItemForm = () => {
  const { id: groceryListId } = useParams();
  const history = useHistory();

  const onAdd = () => {
    history.push(`/grocerylists/${groceryListId}`);
  };

  return <GroceryItemForm listId={groceryListId} onItemAdded={onAdd} />;
};

export default NewItemForm;
