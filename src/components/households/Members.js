import React from "react";

import Badge from "react-bootstrap/Badge";

const Members = ({ creator, members }) => {
  return (
    <>
      <div>
        {creator} <Badge variant="primary">Creator</Badge>
      </div>
      {members.map((member) => (
        <div>
          {member.user_name} <Badge variant="secondary">Member</Badge>
        </div>
      ))}
    </>
  );
};

export default Members;
