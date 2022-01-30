import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Container, Grid } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axios from "axios";
import { RatingCard, RatingCardEditable } from "../components/Ratings";
import { CommentCard, CommentCardEditable } from "../components/Comments";
import HeadingCard from "../components/Heading";
import {
  parseComments,
  parseRatings,
  addName,
  getPerson,
  sortCombinedArray,
} from "../components/Functions";

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

const {
  REACT_APP_STUDENT_RATING_URL,
  REACT_APP_STUDENT_COMMENT_URL,
  REACT_APP_RATINGSFROMSTUDENT_URL,
  REACT_APP_COMMENTSFROMSTUDENT_URL,
  REACT_APP_ALLSTUDENTS_URL,
  REACT_APP_ALLTUTORS_URL,
} = process.env;

const clientRating = axios.create({
  baseURL: `${REACT_APP_STUDENT_RATING_URL}`,
});

const clientComment = axios.create({
  baseURL: `${REACT_APP_STUDENT_COMMENT_URL}`,
});

const clientSRating = axios.create({
  baseURL: `${REACT_APP_RATINGSFROMSTUDENT_URL}`,
});

const clientSComment = axios.create({
  baseURL: `${REACT_APP_COMMENTSFROMSTUDENT_URL}`,
});

const studentClient = axios.create({
  baseURL: REACT_APP_ALLSTUDENTS_URL,
});
const tutorClient = axios.create({
  baseURL: REACT_APP_ALLTUTORS_URL,
});

// main function including tabs
const StudentDetails = () => {
  // create instance of style obj
  const classes = useStyles();
  // get studentid from params
  const { studentid } = useParams();
  // get tutorid from localStorage
  const tutorid = localStorage.getItem("tutorid");

  // get student details
  const [studentName, setStudentName] = useState("undefined");
  const retrieveName = async () => {
    const studentArr = await studentClient.get();
    let name = getPerson(studentid, studentArr.data);
    setStudentName(name);
  };
  React.useEffect(() => {
    retrieveName();
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
          <HeadingCard name={studentName} />
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
        <StudentComment
          receivername={studentName}
          studentid={studentid}
          tutorid={tutorid}
        />
      )}
    </>
  );
};

// function for getting ratings of student from api
const StudentRating = ({ studentid, tutorid }) => {
  const classes = useStyles();

  const [ratingsArray, setRatingsArray] = useState([]);
  // api call to retrieve all comments of a student
  const retrieveRating = async () => {
    const tRes = await clientRating.get(`/${studentid}?showid=1`);
    const studentArr = await studentClient.get();
    const tutorArr = await tutorClient.get();

    // retrieve all students and tutors
    let modified_tRes = addName(tRes.data, tutorArr.data, "rating");
    // call 3.9 package here
    const sRes = await clientSRating.get();
    let modified_sRes = parseRatings(sRes.data);
    let modified_sRes2 = addName(modified_sRes, studentArr.data, "rating");

    let combinedArray = sortCombinedArray(modified_tRes, modified_sRes2);
    console.log(combinedArray);
    setRatingsArray(combinedArray);
  };

  React.useEffect(() => {
    retrieveRating();
  }, []);

  const [ratingFromTutor, setRatingFromTutor] = useState(""); // api student's rating from tutor
  const retrieveRatingFromTutor = async () => {
    const rating = await clientRating.get(`/${studentid}/from/${tutorid}`);
    const studentArr = await studentClient.get();
    let name = getPerson(studentid, studentArr.data);
    rating.data["receiverName"] = name;
    setRatingFromTutor(rating.data);
  };
  React.useEffect(() => {
    retrieveRatingFromTutor();
  }, []);

  if (!ratingsArray) {
    return (
      <Container className={classes.container}>
        <p className={classes.center}>No ratings given yet :C</p>
        <Grid container className={classes.center}>
          <RatingCardEditable
            updateRating={retrieveRating}
            rating={ratingFromTutor}
          />
        </Grid>
      </Container>
    );
  } else {
    return (
      <Container className={classes.container}>
        {ratingsArray.map((rating) => {
          return (
            <Grid container className={classes.center} key={rating.raterId}>
              <RatingCard rating={rating} />
            </Grid>
          );
        })}
        <Grid className={classes.center}>
          <RatingCardEditable
            updateRating={retrieveRating}
            rating={ratingFromTutor}
          />
        </Grid>
      </Container>
    );
  }
};

// function for getting comment of student from api
const StudentComment = ({ receivername, studentid, tutorid }) => {
  const classes = useStyles();
  const [commentsArray, setCommentsArray] = useState([]);

  // api call to retrieve all comments of a student
  const retrieveComments = async () => {
    const tRes = await clientComment.get(`/${studentid}?showid=1`);
    const studentArr = await studentClient.get();
    const tutorArr = await tutorClient.get();

    // retrieve all students and tutors
    let modified_tRes = addName(tRes.data, tutorArr.data, "comment");
    // call 3.9 package here
    const sRes = await clientSComment.get();
    let modified_sRes = parseComments(sRes.data);
    let modified_sRes2 = addName(modified_sRes, studentArr.data, "comment");

    let combinedArray = sortCombinedArray(modified_tRes, modified_sRes2);
    console.log(combinedArray);
    setCommentsArray(combinedArray);
  };

  React.useEffect(() => {
    retrieveComments();
  }, []);

  if (!commentsArray) {
    return (
      <Container className={classes.container}>
        <p className={classes.center}>No comments given yet :C</p>
        <Grid container className={classes.center}>
          <CommentCardEditable
            receivername={receivername}
            updateComments={retrieveComments}
            tutorid={tutorid}
            studentid={studentid}
          />
        </Grid>
      </Container>
    );
  } else {
    return (
      <Container className={classes.container}>
        {commentsArray.map((comment, index) => {
          return (
            <Grid container className={classes.center} key={index}>
              <CommentCard
                comment={comment}
                tutorid={tutorid}
                updateComments={retrieveComments}
              />
            </Grid>
          );
        })}
        <Grid className={classes.center}>
          <CommentCardEditable
            receivername={receivername}
            updateComments={retrieveComments}
            tutorid={tutorid}
            studentid={studentid}
          />
        </Grid>
      </Container>
    );
  }
};

export { StudentDetails, StudentRating, StudentComment };
