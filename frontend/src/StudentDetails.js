import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const client = axios.create({
  baseURL: `http://localhost:8181/api/v1/ratings`,
});
// function for getting ratings of student from api
const StudentRating = ({ id }) => {
  const [ratingsArray, setRatingsArray] = useState(null); // api student's ratings

  React.useEffect(() => {
    client.get(`/${id}`).then((res) => {
      console.log(res.data);
      setRatingsArray(res.data);
    });
  }, []);

  if (!ratingsArray) return null;
  return (
    <div>
      {ratingsArray.map((rating, index) => {
        return (
          // pass rating into cards component
          <li key={index}>
            <ul>{rating.id}</ul>
            <ul>{rating.rating}</ul>
            <ul>{rating.raterId}</ul>
            <ul>{rating.raterType}</ul>
            <ul>{rating.receiverId}</ul>
            <ul>{rating.receiverType}</ul>
            <ul>{rating.datetime}</ul>
            <ul>{rating.anonymous}</ul>
          </li>
        );
      })}
    </div>
  );
};

function StudentDetails() {
  const { studentid } = useParams();
  console.log(studentid);

  return (
    <div>
      <h5>{studentid}</h5>
      <StudentRating id={studentid} />
    </div>
  );
}

export default StudentDetails;
