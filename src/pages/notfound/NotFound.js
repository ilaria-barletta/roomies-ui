import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

const NotFound = () => {
  return (
    <>
      <h1 className="mb-3">Page not found</h1>
      <p>
        We're really sorry. The page you were looking for could not be found.
      </p>
      <Link to="/" className="mr-1">
        <Button>Back to home</Button>
      </Link>
    </>
  );
};

export default NotFound;
