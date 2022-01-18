import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import ReactStars from "react-stars";

const useStyles = makeStyles({
  ratingWidth: {
    width: 300,
    minWidth: 300,
  },
  commentWidth: {
    width: 350,
    minWidth: 350,
  },
  star: {
    fontSize: "32px",
  },
});

const RatingCard = ({ rating }) => {
  const classes = useStyles();

  return (
    <Card
      className={classes.ratingWidth}
      sx={{ borderRadius: "10px", border: 1.5, borderColor: "#999999" }}
      variant="outlined"
    >
      <CardContent>
        <Typography sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
          {rating.raterName} ({rating.raterType})
        </Typography>
        <Typography variant="h6" component="div">
          {/* {rating.rating} */}
          <ReactStars
            edit={false}
            value={rating.rating}
            count={5}
            size={32}
            color1={"#C7C7C7"}
            color2={"#FDCC0D"}
          />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Rated {rating.rating} stars on {rating.datetime}
        </Typography>
      </CardContent>
    </Card>
  );
};

const CommentCard = (comment) => {
  const classes = useStyles();

  return (
    <Card className={classes.commentWidth} variant="outlined">
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
          {comment.commentorName}
        </Typography>
        <Typography variant="h5" component="div">
          {comment.comment}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Commented on {comment.datetime}
        </Typography>
      </CardContent>
    </Card>
  );
};

export { RatingCard, CommentCard };
