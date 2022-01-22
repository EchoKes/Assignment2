import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { Checkbox, Container, FormControlLabel } from "@mui/material";

const useStyles = makeStyles({
  commentWidth: {
    width: 600,
    minWidth: 600,
  },
  commentEditableWidth: {
    width: 700,
    minWidth: 700,
  },
  inline: {
    display: "inline-flex",
    paddingBottom: "8px",
    width: "auto",
    height: "auto",
  },
});

const client = axios.create({
  baseURL: `http://localhost:8182/comments`,
});

var defaultComment = "nil";
var defaultAnon = false;

const CommentCard = ({ comment, tutorid }) => {
  const classes = useStyles();

  return (
    <Card
      className={classes.commentWidth}
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
        <Typography className={classes.inline} variant="h6">
          {comment.comment}
        </Typography>
        <Typography
          sx={{ fontSize: 18 }}
          color="text.primary"
          className={classes.inline}
        >
          &nbsp; –&nbsp; {comment.commentorName} ({comment.commentorType})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Commented on {comment.datetime}
        </Typography>
      </CardContent>
      {comment.commentorId === tutorid && <EditComment comment={comment} />}
    </Card>
  );
};

const commentChanged = (commentDetails) => {
  commentDetails.anonymous = defaultAnon;

  if (defaultComment == "nil") {
    client.post(`/${commentDetails.receiverId}`, commentDetails).then((res) => {
      console.log("comment posted!");
      console.log(res);
    });
  } else {
    console.log(commentDetails);
    client.put(`/${commentDetails.receiverId}`, commentDetails).then((res) => {
      console.log("comment updated!");
      console.log(res);
    });
  }
  // window.location.reload(false);
};

const CommentCardEditable = ({ comment }) => {
  const classes = useStyles();
  defaultComment = comment.comment;

  const [checked, setChecked] = useState(false);

  const anonCheckboxChange = (event) => {
    setChecked(event.target.checked);
    defaultAnon = !checked;
  };

  return (
    <Card
      className={classes.commentEditableWidth}
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
        Give {comment.receiverName} a comment:
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
        {/* TODO: comment input field */}
      </Container>
    </Card>
  );
};

const EditComment = ({ comment }) => {
  return <p>comment id: {comment.id}</p>;
};

export { CommentCard, CommentCardEditable };
