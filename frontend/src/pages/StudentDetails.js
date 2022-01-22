import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Container, Grid } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axios from "axios";
import {
  RatingCard,
  RatingCardEditable,
} from "../components/RatingCardComponent";
import {
  CommentCard,
  CommentCardEditable,
} from "../components/CommentCardComponent";
import HeadingCard from "../components/HeadingComponent";

const useStyles = makeStyles({
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
  },
  container: {
    padding: "20px",
  },
});

const clientRating = axios.create({
  baseURL: `http://localhost:8181/ratings`,
});

const clientComment = axios.create({
  baseURL: `http://localhost:8182/comments`,
});

// main function including tabs
const StudentDetails = () => {
  // create instance of style obj
  const classes = useStyles();
  // get studentid from params
  const { studentid } = useParams();
  // get tutorid from localStorage
  const tutorid = localStorage.getItem("tutorid");

  // get tutor's rating for student
  // this hook has to be used here before calling the student rating
  const [ratingFromTutor, setRatingFromTutor] = useState(() => {
    return "";
  });

  React.useEffect(() => {
    clientRating.get(`/${studentid}/${tutorid}`).then((res) => {
      console.log("initial rating details from tutor retrieved.");
      setRatingFromTutor(res.data);
    });
  }, []);

  // get current tab's value
  const [tabValue, setTabValue] = React.useState(0);
  // set tab's value
  const handleTab = (event, newValue) => {
    setTabValue(newValue);
  };

  // render
  return (
    <>
      <Container className={classes.container}>
        <Grid className={classes.center}>
          <HeadingCard name={ratingFromTutor.receiverName} />
        </Grid>
      </Container>

      <Tabs value={tabValue} onChange={handleTab} centered>
        <Tab label="Ratings" />
        <Tab label="Comments" />
      </Tabs>
      {tabValue === 0 && (
        <StudentRating studentid={studentid} tutorid={tutorid} />
      )}
      {tabValue === 1 && (
        <StudentComment studentid={studentid} tutorid={tutorid} />
      )}
    </>
  );
};

// function for getting ratings of student from api
const StudentRating = ({ studentid, tutorid }) => {
  const classes = useStyles();

  const [ratingsArray, setRatingsArray] = useState(() => {
    return null;
  });
  const [ratingFromTutor, setRatingFromTutor] = useState(() => {
    return "";
  }); // api student's rating from tutor

  React.useEffect(() => {
    clientRating.get(`/${studentid}`).then((res) => {
      console.log(res.data);
      setRatingsArray(res.data);
    });
  }, []);

  React.useEffect(() => {
    clientRating.get(`/${studentid}/${tutorid}`).then((res) => {
      console.log("rating from tutor retrieved.");
      setRatingFromTutor(res.data);
    });
  }, []);

  if (!ratingsArray) {
    return (
      <Container className={classes.container}>
        <p className={classes.center}>No ratings given yet :C</p>
        <Grid container className={classes.center}>
          <RatingCardEditable rating={ratingFromTutor} />
        </Grid>
      </Container>
    );
  } else {
    return (
      <Container className={classes.container}>
        {ratingsArray.map((rating) => {
          return (
            <Grid container className={classes.center} key={rating.id}>
              <RatingCard rating={rating} />
            </Grid>
          );
        })}
        <Grid className={classes.center}>
          <RatingCardEditable rating={ratingFromTutor} />
        </Grid>
      </Container>
    );
  }
};

// function for getting comment of student from api
const StudentComment = ({ studentid, tutorid }) => {
  const classes = useStyles();

  const [commentsArray, setCommentsArray] = useState(() => {
    return null;
  });
  const [commentFromTutor, setCommentFromTutor] = useState(() => {
    return "";
  });

  React.useEffect(() => {
    clientComment.get(`/${studentid}`).then((res) => {
      console.log(res.data);
      setCommentsArray(res.data);
    });
  }, []);

  React.useEffect(() => {
    clientComment.get(`/${studentid}/${tutorid}`).then((res) => {
      console.log("comment from tutor retrieved.");
      setCommentFromTutor(res.data);
    });
  }, []);

  if (!commentsArray) {
    return (
      <Container className={classes.container}>
        <p className={classes.center}>No comments given yet :C</p>
        <Grid container className={classes.center}>
          <CommentCardEditable comment={commentFromTutor} />
        </Grid>
      </Container>
    );
  } else {
    return (
      <Container className={classes.container}>
        {commentsArray.map((comment) => {
          return (
            <Grid container className={classes.center} key={comment.id}>
              <CommentCard comment={comment} tutorid={tutorid} />
            </Grid>
          );
        })}
        <Grid className={classes.center}>
          <CommentCardEditable comment={commentFromTutor} />
        </Grid>
      </Container>
    );
  }
};

export { StudentDetails, StudentRating, StudentComment };
