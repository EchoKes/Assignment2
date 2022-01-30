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
import EditIcon from "@mui/icons-material/Edit";

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

const { REACT_APP_STUDENT_COMMENT_URL } = process.env;
const client = axios.create({
  baseURL: `${REACT_APP_STUDENT_COMMENT_URL}`,
});

const CommentCard = ({ comment, tutorid, updateComments }) => {
  const classes = useStyles();

  // hooks for onclick edit button
  const [editClick, setEditClick] = useState(false);

  const EditComment = () => {
    const [checked, setChecked] = useState(false);
    const anonCheckboxChange = (event) => {
      setChecked(event.target.checked);
    };

    const EditCommentInputField = () => {
      // getter and setter for comment
      const [editedComment, setEditedComment] = useState("");
      // getter and setter for error
      const [commentError, setCommentError] = useState(false);

      // comments submit handler
      const handleEditCommentSubmit = (e) => {
        setCommentError(false);
        e.preventDefault();

        // trim whitespaces to validate empty spaces when submitting comment
        let trimmedComment = editedComment;
        trimmedComment = trimmedComment.trim();
        if (trimmedComment !== "") {
          // create update comment object
          const updatedComment = {
            id: comment.id,
            comment: trimmedComment,
            anonymous: checked,
          };

          client.put(`/${comment.receiverId}`, updatedComment).then((res) => {
            console.log(res);
            if (res.status === 202) {
              updateComments();
            }
          });
          document.getElementById("editCommentForm").reset();
          setEditedComment("");
        } else {
          setCommentError(true);
        }
      };
      return (
        <form
          id="editCommentForm"
          noValidate
          autoComplete="off"
          onSubmit={handleEditCommentSubmit}
        >
          <TextField
            sx={{ width: "420px", paddingBottom: "10px" }}
            InputProps={{
              className: classes.input,
            }}
            onChange={(e) => setEditedComment(e.target.value)}
            id="outlined-multiline-static"
            label="Update Comment"
            placeholder="Say something nice"
            multiline
            rows={1}
            error={commentError}
          />
          <Button
            sx={{ marginLeft: "10px" }}
            type="submit"
            variant="contained"
            color="success"
            className={classes.input}
          >
            <KeyboardArrowRightIcon />
          </Button>
        </form>
      );
    };

    return (
      <Card
        className={classes.commentWidth}
        sx={{
          marginTop: "5px",
          padding: "0 1.5em",
          borderRadius: 0,
          border: 2,
          borderColor: "#DADADA",
        }}
        variant="outlined"
      >
        <Typography
          sx={{
            fontSize: 20,
            justifyContent: "center",
            display: "flex",
            marginLeft: "10px",
          }}
          color="text.secondary"
        >
          Edit comment:
        </Typography>
        <FormControlLabel
          sx={{
            justifyContent: "left",
            display: "inline-flex",
            marginLeft: "20px",
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
          <EditCommentInputField />
        </Container>
      </Card>
    );
  };

  return (
    <>
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
        {comment.commentorId === tutorid && (
          <Button
            sx={{
              marginLeft: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setEditClick(!editClick)}
          >
            <EditIcon />
          </Button>
        )}
      </Card>
      {editClick && <EditComment className={classes.inline} />}
    </>
  );
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
          display: "inline-flex",
          marginLeft: "30px",
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
    if (trimmedComment !== "") {
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

export { CommentCard, CommentCardEditable };
