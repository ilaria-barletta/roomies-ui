import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import { toast } from "react-toastify";
import { axiosReq } from "../../api/axiosDefaults";

const NewHouseholdMember = () => {
  const { id: householdId } = useParams();
  const history = useHistory();
  const [availableMembers, setAvailableMembers] = useState();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const goBack = () => {
    // Found here: https://v5.reactrouter.com/web/api/history
    history.goBack();
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const loadAvailableMembers = async () => {
    setLoading(true);
    const { data } = await axiosReq.get(
      `/households/${householdId}/availableusers?search=${search}`
    );
    setAvailableMembers(data);
    setLoading(false);
  };

  const onSearchSubmit = (event) => {
    event.preventDefault();
    loadAvailableMembers();
  };

  const onAddNewMemberClick = async (newMemberToAdd) => {
    try {
      await axiosReq.post(`/households/${householdId}/members`, {
        user: newMemberToAdd,
      });
      loadAvailableMembers();
      toast.success("Successfully added new household member");
    } catch (err) {
      toast.error(
        "Failed to add the member to the household. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <>
      <h1 className="mb-3">Add a new member</h1>
      <div className="mb-3">
        <Form onSubmit={onSearchSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search for a member to add"
              name="name"
              value={search}
              onChange={handleSearchChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Search
          </Button>
        </Form>
      </div>
      {availableMembers && availableMembers.length > 0 && (
        <div>
          <h3>{availableMembers?.length} results</h3>
          {availableMembers?.map((member) => (
            <div className="d-flex justify-content-between mb-3">
              {member.username}
              <Button
                variant="secondary"
                onClick={() => onAddNewMemberClick(member.id)}
              >
                Add
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button variant="secondary" className="mt-3" onClick={goBack}>
        Back
      </Button>
    </>
  );
};

export default NewHouseholdMember;
