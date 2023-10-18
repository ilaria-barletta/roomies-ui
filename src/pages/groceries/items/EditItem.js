import { axiosReq } from "../../../api/axiosDefaults";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import GroceryItemForm from "../../../components/households/groceries/GroceryItemForm";

const EditItemForm = () => {
  const { id: groceryListId, itemId } = useParams();
  const history = useHistory();
  const [item, setItem] = useState();

  const loadItem = async () => {
    const { data } = await axiosReq.get(`/groceryitems/${itemId}/`);
    setItem(data);
  };

  useEffect(() => {
    loadItem();
  }, []);

  const onAdd = () => {
    history.push(`/grocerylists/${groceryListId}`);
  };

  if (!item) {
    return null;
  }

  return (
    <GroceryItemForm
      listId={groceryListId}
      onItemAdded={onAdd}
      existingItem={item}
    />
  );
};

export default EditItemForm;
