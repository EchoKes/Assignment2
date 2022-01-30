import React, { useState } from "react";
import { useParams } from "react-router-dom";

const TutorComments = () => {
  // get tutorid from params
  const { tutorid } = useParams();

  return (
    <div>
      <p>this is tutor comments page</p>
      {tutorid}
    </div>
  );
};

export { TutorComments };
