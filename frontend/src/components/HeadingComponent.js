import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import React from "react";
import FaceIcon from "@mui/icons-material/Face";

const HeadingCard = ({ name }) => {
  return (
    <CardContent>
      <FaceIcon
        sx={{
          height: 110,
          width: 110,
          display: "inline-block",
        }}
      />
      <Typography
        variant="h2"
        component="div"
        noWrap
        sx={{
          paddingLeft: 2,
          display: "inline-block",
        }}
      >
        {name}
      </Typography>
    </CardContent>
  );
};

export default HeadingCard;
