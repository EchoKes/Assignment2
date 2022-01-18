import * as React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { makeStyles } from "@mui/styles";
import FaceIcon from "@mui/icons-material/Face";

const useStyles = makeStyles({
  root: {
    width: 300,
    minWidth: 300,
  },
});

function CardDetails({ id, name }) {
  const classes = useStyles();
  let navigate = useNavigate();

  return (
    <Card
      className={classes.root}
      sx={{ borderRadius: "10px", border: 1.5, borderColor: "grey.500" }}
    >
      <CardActionArea
        onClick={() => {
          navigate(`/dashboard/${id}`);
        }}
      >
        <CardContent>
          <div>
            <FaceIcon
              sx={{
                height: 80,
                width: 80,
                display: "inline",
              }}
            />
            <Typography
              variant="h4"
              component="div"
              noWrap
              sx={{
                paddingLeft: 2,
                position: "absolute",
                top: 40,
                display: "inline",
              }}
            >
              {name}
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default CardDetails;
