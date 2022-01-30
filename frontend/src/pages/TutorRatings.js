import React, { useState } from "react";
import { useParams } from "react-router-dom";

const TutorRatings = () => {
  // get tutorid from params
  const { tutorid } = useParams();

  return (
    <div>
      <p>this is tutor ratings page</p>
      {tutorid}
    </div>
  );
};

export { TutorRatings };
