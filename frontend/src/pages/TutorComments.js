import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { useParams } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axios from "axios";
import {
  addName,
  extractAnon,
  parseComments,
  sortCombinedArray,
} from "../components/Functions";
import { Container, Grid } from "@mui/material";
import { CommentCard } from "../components/Comments";

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
  REACT_APP_TUTOR_COMMENT_URL,
  REACT_APP_ALLSTUDENTS_URL,
  REACT_APP_TUTORCOMMENTSFROMSTUDENT_URL,
} = process.env;

// from my package
const tutorComment = axios.create({
  baseURL: `${REACT_APP_TUTOR_COMMENT_URL}`,
});

// from 3.9's package
const tutorComment2 = axios.create({
  baseURL: `${REACT_APP_TUTORCOMMENTSFROMSTUDENT_URL}`,
});

const studentClient = axios.create({
  baseURL: REACT_APP_ALLSTUDENTS_URL,
});

const TutorComments = () => {
  // get tutorid from params
  const { tutorid } = useParams();

  // get current tab's value
  const [tabValue, setTabValue] = React.useState(0);
  // set tab's value
  const handleTab = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Tabs value={tabValue} onChange={handleTab} centered>
        <Tab label="Given" />
        <Tab label="Received" />
        <Tab label="Anonymous" />
      </Tabs>
      {tabValue === 0 && <Comments tutorid={tutorid} type={"given"} />}
      {tabValue === 1 && <Comments tutorid={tutorid} type={"received"} />}
      {tabValue === 2 && <Comments tutorid={tutorid} type={"anonymous"} />}
    </>
  );
};

const Comments = ({ tutorid, type }) => {
  const classes = useStyles();
  const [commentsArray, setCommentsArray] = useState([]);
  let emptyResponse = `You have not ${type} any comments :C`;

  // api call to retrieve all comments given/received by tutor
  const retrieveComments = async () => {
    let commentArr = [];
    const studentArr = await studentClient.get();

    switch (type) {
      case "anonymous":
        let anonArray = await tutorComment2.get(`?targetId=${tutorid}`);
        let unextractedArr = [...anonArray.data];
        commentArr = extractAnon(unextractedArr);
        emptyResponse = "No anonymous comments from students. C:";
        break;
      case "received":
        let receivedArray = await tutorComment2.get(`?targetId=${tutorid}`);
        commentArr = [...receivedArray.data];
        break;
      case "given":
        let givenArray = await tutorComment.get(`/${tutorid}/${type}`);
        commentArr = [...givenArray.data];
        break;
    }

    let modified_commentArr = [];
    if (type !== "given") {
      let clean_commentArr = parseComments(commentArr);
      modified_commentArr = [...clean_commentArr];
    } else {
      modified_commentArr = [...commentArr];
    }

    let name_commentsArr = addName(
      modified_commentArr,
      studentArr.data,
      "comment"
    );

    let finalCommentsArr = sortCombinedArray(name_commentsArr, []);

    setCommentsArray(finalCommentsArr);
  };

  React.useEffect(() => {
    retrieveComments();
  }, []);

  if (!commentsArray) {
    return <p className={classes.center}>{emptyResponse}</p>;
  } else {
    return (
      <Container className={classes.container}>
        {commentsArray.map((comment) => {
          return (
            <Grid container className={classes.center} key={comment.id}>
              {type !== "given" && (
                <CommentCard
                  comment={comment}
                  tutorid={tutorid}
                  updateComments={retrieveComments}
                />
              )}
              {type === "given" && (
                <CommentCard
                  comment={comment}
                  tutorid={tutorid}
                  updateComments={retrieveComments}
                  personal={true}
                />
              )}
            </Grid>
          );
        })}
      </Container>
    );
  }
};

export { TutorComments };
