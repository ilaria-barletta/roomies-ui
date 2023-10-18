import React from "react";
import { useCurrentUser } from "../../../contexts/CurrentUserContext";
import { DropdownButton, Dropdown, Badge } from "react-bootstrap";
import { axiosReq } from "../../../api/axiosDefaults";
import { toast } from "react-toastify";

const Rent = ({ household, householdChanged }) => {
  const currentUser = useCurrentUser();

  const isOwner = currentUser?.username === household.creator;
  const householdMember = household.members.find(
    (m) => m.user === currentUser?.pk
  );

  const hasPaid = isOwner
    ? household.creator_has_paid_rent
    : householdMember?.has_paid_rent;

  const isDue = household.rent_is_due && !hasPaid;

  const hasEveryonePaid = () => {
    const allMembersPaid = !household.members.find(
      (member) => !member.has_paid_rent
    );

    return allMembersPaid && household.creator_has_paid_rent;
  };

  const markRentDue = async () => {
    try {
      await axiosReq.post(`/households/${household.id}/markrentdue`);
      toast.success("Successfully marked household rent as due.");
      householdChanged();
    } catch {
      toast.error("Failed to mark household rent as due. Please try again.");
    }
  };

  const markRentCollected = async () => {
    try {
      const householdData = {
        ...household,
        rent_is_due: false,
      };
      await axiosReq.put(`/households/${household.id}/`, householdData);
      toast.success("Successfully marked household rent as collected.");
      householdChanged();
    } catch {
      toast.error(
        "Failed to mark household rent as collected. Please try again."
      );
    }
  };

  const markRentPaid = async () => {
    try {
      if (isOwner) {
        const householdData = {
          ...household,
          creator_has_paid_rent: true,
        };

        await axiosReq.put(`/households/${household.id}/`, householdData);
        toast.success("Successfully marked rent as paid");
        householdChanged();
      } else {
        const memberData = {
          ...householdMember,
          has_paid_rent: true,
        };
        await axiosReq.put(
          `/households/${household.id}/members/${householdMember.id}`,
          memberData
        );
        toast.success("Successfully marked rent as paid");
        householdChanged();
      }
    } catch {
      toast.error("Failed to mark rent as paid. Please try again");
    }
  };

  const currentUserRentAmount = () => {
    // + 1 to include the household creator
    return household.rent / (household.members.length + 1);
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <h4>Rent</h4>
        <DropdownButton id="manage-household-button" title="Rent Actions">
          {isOwner && (
            <>
              <Dropdown.Item
                disabled={household.rent_is_due}
                onClick={markRentDue}
              >
                Mark rent due
              </Dropdown.Item>
              <Dropdown.Item
                disabled={!household.rent_is_due || !hasEveryonePaid()}
                onClick={markRentCollected}
              >
                Mark rent collected
              </Dropdown.Item>
            </>
          )}
          <Dropdown.Item
            onClick={markRentPaid}
            disabled={!household.rent_is_due || hasPaid}
          >
            Pay Rent
          </Dropdown.Item>
        </DropdownButton>
      </div>
      <p>Household Rent amount: {household.rent}</p>
      <p>
        Your rent amount: {currentUserRentAmount()}{" "}
        {isDue ? "(due)" : <i className="fas fa-check"></i>}
      </p>
      <div>
        <h5 className="mb-1">Members Rent Status</h5>
        {household.members.map((member) => (
          <div>
            {member.user_name}{" "}
            {member.has_paid_rent ? (
              <Badge variant="success">Paid</Badge>
            ) : (
              <Badge variant="danger">Due</Badge>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Rent;
