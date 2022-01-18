import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { RatingCard } from "./StudentCard";

const client = axios.create({
  baseURL: `http://localhost:8181/api/v1/ratings`,
});

// function for getting ratings of student from api
const StudentRating = () => {
  const { studentid } = useParams();
  console.log(studentid);
  const [ratingsArray, setRatingsArray] = useState(null); // api student's ratings

  React.useEffect(() => {
    client.get(`/${studentid}`).then((res) => {
      console.log(res.data);
      setRatingsArray(res.data);
    });
  }, [studentid]);

  if (!ratingsArray) return <p>No ratings given yet :C</p>;
  return (
    <div>
      {ratingsArray.map((rating) => {
        return (
          // pass rating into cards component
          <RatingCard key={rating.id} rating={rating}></RatingCard>
        );
      })}
    </div>
  );
};

export default StudentRating;
