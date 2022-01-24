import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { Checkbox, Container, FormControlLabel } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const useStyles = makeStyles({
  commentWidth: {
    width: 550,
    minWidth: 550,
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
  input: {
    height: "65px",
  },
});

const client = axios.create({
  baseURL: `http://127.0.0.1:8182/comments`,
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

const CommentCardEditable = ({
  receivername,
  updateComments,
  tutorid,
  studentid,
}) => {
  const classes = useStyles();
  // defaultComment = comment.comment;

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
        Give {receivername} a comment:
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
        <CommentInputField
          updateComments={updateComments}
          tutorid={tutorid}
          studentid={studentid}
          anon={checked}
        />
      </Container>
    </Card>
  );
};

const CommentInputField = ({ updateComments, tutorid, studentid, anon }) => {
  // create instance of class object
  const classes = useStyles();
  // getter and setter for comment
  const [comment, setComment] = useState("");
  // getter and setter for error
  const [commentError, setCommentError] = useState(false);

  // comments submit handler
  const handleCommentSubmit = (e) => {
    setCommentError(false);
    e.preventDefault();

    // trim whitespaces to validate empty spaces when submitting comment
    let trimmedComment = comment;
    trimmedComment = trimmedComment.trim();
    if (trimmedComment != "") {
      // create new comment object
      const newComment = {
        comment: trimmedComment,
        commentorId: tutorid,
        receiverId: studentid,
        anonymous: anon,
      };

      client.post(`/${studentid}`, newComment).then((res) => {
        console.log(res);
        if (res.status === 201) {
          updateComments();
        }
      });
      document.getElementById("commentForm").reset();
      setComment("");
    } else {
      setCommentError(true);
    }
  };
  return (
    <form
      id="commentForm"
      noValidate
      autoComplete="off"
      onSubmit={handleCommentSubmit}
    >
      <TextField
        InputProps={{
          className: classes.input,
        }}
        sx={{ width: "550px" }}
        onChange={(e) => setComment(e.target.value)}
        id="outlined-multiline-static"
        label="Write Comment"
        placeholder="Say something nice"
        multiline
        fullWidth
        rows={1}
        error={commentError}
      />
      <Button
        sx={{ marginLeft: "10px" }}
        type="submit"
        variant="contained"
        className={classes.input}
      >
        <KeyboardArrowRightIcon />
      </Button>
    </form>
  );
};

const EditComment = ({ comment }) => {
  return <p>comment id: {comment.id}</p>;
};

export { CommentCard, CommentCardEditable };
