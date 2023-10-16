import React, { useEffect, useState } from "react";
import axios from "axios";

const useHouseholdMembers = (householdId) => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHousehold = async () => {
    const { data } = await axios.get(`/households/${householdId}/`);
    return data;
  };

  const loadMembers = async () => {
    const household = await loadHousehold();
    const allMembers = household.members.concat([
      { user: household.creator_id, user_name: household.creator },
    ]);
    setMembers(allMembers);
    setIsLoading(false);
  };

  useEffect(() => {
    if (householdId) {
      loadMembers();
    }
  }, [householdId]);

  return {
    members,
    isLoading,
  };
};

export default useHouseholdMembers;
