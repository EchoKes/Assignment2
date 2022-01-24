import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import ReactStars from "react-stars";
import axios from "axios";
import { Checkbox, Container, FormControlLabel } from "@mui/material";

const useStyles = makeStyles({
  ratingWidth: {
    width: 450,
    minWidth: 450,
  },
  ratingEditableWidth: {
    width: 500,
    minWidth: 500,
  },
  inline: {
    display: "inline-flex",
    paddingBottom: "8px",
    width: "auto",
    height: "auto",
  },
});

const client = axios.create({
  baseURL: `http://172.20.30.96:8181/ratings`,
});

var defaultRating = -1;
var defaultAnon = false;

const RatingCard = ({ rating }) => {
  const classes = useStyles();

  return (
    <Card
      className={classes.ratingWidth}
      sx={{
        display: "flex",
        padding: "0 1.5em",
        borderRadius: "10px",
        border: 1.5,
        borderColor: "#999999",
        alignItems: "center",
      }}
      variant="outlined"
    >
      <CardContent>
        <ReactStars
          className={classes.inline}
          edit={false}
          value={rating.rating}
          count={5}
          size={32}
          color1={"#C7C7C7"}
          color2={"#FDCC0D"}
        />
        <Typography
          sx={{ fontSize: 18 }}
          color="text.primary"
          className={classes.inline}
        >
          &nbsp; –&nbsp; {rating.raterName} ({rating.raterType})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Rated {rating.rating} stars on {rating.datetime}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ratingChanged = ({ updateRating, rating }) => {
  rating.anonymous = defaultAnon;

  if (defaultRating < 0) {
    client.post(`/${rating.receiverId}`, rating).then((res) => {
      console.log("rating posted!");
      console.log(res);
      if (res.status === 201) {
        updateRating();
      }
    });
  } else {
    console.log(rating);
    client.put(`/${rating.receiverId}`, rating).then((res) => {
      console.log("rating updated!");
      console.log(res);
      if (res.status === 202) {
        updateRating();
      }
    });
  }
};

const RatingCardEditable = ({ updateRating, rating }) => {
  const classes = useStyles();
  defaultRating = rating.rating;

  const [checked, setChecked] = useState(false);

  const anonCheckboxChange = (event) => {
    setChecked(event.target.checked);
    defaultAnon = !checked;
  };

  return (
    <Card
      className={classes.ratingEditableWidth}
      sx={{ borderRadius: "12px", border: 2, padding: "15px" }}
      variant="outlined"
    >
      <Typography
        sx={{
          fontSize: 30,
          justifyContent: "center",
          display: "flex",
        }}
        color="text.primary"
      >
        Give {rating.receiverName} a rating:
      </Typography>
      <FormControlLabel
        sx={{
          justifyContent: "center",
          display: "flex",
        }}
        label="Anonymous"
        labelPlacement="end"
        control={<Checkbox checked={checked} onChange={anonCheckboxChange} />}
      />

      <Container
        sx={{
          justifyContent: "center",
          display: "flex",
        }}
      >
        <ReactStars
          onChange={(newRating) => {
            rating.rating = newRating;
            rating.anonymous = checked;
            ratingChanged({ updateRating, rating });
          }}
          value={rating.rating}
          count={5}
          size={54}
          half={false}
          color1={"#C7C7C7"}
          color2={"#FDCC0D"}
        />
      </Container>
    </Card>
  );
};

export { RatingCard, RatingCardEditable };
