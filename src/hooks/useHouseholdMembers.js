import { useEffect, useState, useCallback } from "react";
import { axiosReq } from "../api/axiosDefaults";

const useHouseholdMembers = (householdId) => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHousehold = useCallback(async () => {
    const { data } = await axiosReq.get(`/households/${householdId}/`);
    return data;
  }, [householdId]);

  const loadMembers = useCallback(async () => {
    const household = await loadHousehold();
    const allMembers = household.members.concat([
      { user: household.creator_id, user_name: household.creator },
    ]);
    setMembers(allMembers);
    setIsLoading(false);
  }, [loadHousehold]);

  useEffect(() => {
    if (householdId) {
      loadMembers();
    }
  }, [loadMembers, householdId]);

  return {
    members,
    isLoading,
  };
};

export default useHouseholdMembers;
