import React from "react";
import { useParams } from "react-router-dom";

function StudentDetails() {
  const { studentid } = useParams();
  console.log(studentid);

  return <p>{studentid}</p>;
}

export default StudentDetails;
