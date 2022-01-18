import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  commentWidth: {
    width: 350,
    minWidth: 350,
  },
});

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

const CommentCardEditable = () => {
  return <p>placeholder</p>;
};

export { CommentCard, CommentCardEditable };
