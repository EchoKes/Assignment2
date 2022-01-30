import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { useParams } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axios from "axios";
import {
  addName,
  extractAnon,
  parseRatings,
  sortCombinedArray,
} from "../components/Functions";
import { Container, Grid } from "@mui/material";
import { RatingCard, RatingUpdateCard } from "../components/Ratings";

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
  REACT_APP_TUTOR_RATING_URL,
  REACT_APP_ALLSTUDENTS_URL,
  REACT_APP_TUTORRATINGSFROMSTUDENT_URL,
} = process.env;

// from my package
const tutorRating = axios.create({
  baseURL: `${REACT_APP_TUTOR_RATING_URL}`,
});

// from 3.9's package
const tutorRating2 = axios.create({
  baseURL: `${REACT_APP_TUTORRATINGSFROMSTUDENT_URL}`,
});

const studentClient = axios.create({
  baseURL: REACT_APP_ALLSTUDENTS_URL,
});

const TutorRatings = () => {
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
      {tabValue === 0 && <Ratings tutorid={tutorid} type={"given"} />}
      {tabValue === 1 && <Ratings tutorid={tutorid} type={"received"} />}
      {tabValue === 2 && <Ratings tutorid={tutorid} type={"anonymous"} />}
    </>
  );
};

const Ratings = ({ tutorid, type }) => {
  const classes = useStyles();
  const [ratingsArray, setRatingsArray] = useState([]);
  let emptyResponse = `You have not ${type} any ratings :C`;

  // api call to retrieve all comments given/received by tutor
  const retrieveRatings = async () => {
    let ratingArr = [];
    const studentArr = await studentClient.get();

    switch (type) {
      case "anonymous":
        let anonArray = await tutorRating2.get(`?targetId=${tutorid}`);
        let unextractedArr = [...anonArray.data];
        ratingArr = extractAnon(unextractedArr);
        emptyResponse = "No anonymous ratings from students. C:";
        break;
      case "received":
        let receivedArray = await tutorRating2.get(`?targetId=${tutorid}`);
        ratingArr = [...receivedArray.data];
        break;
      case "given":
        let givenArray = await tutorRating.get(`/${tutorid}/${type}`);
        ratingArr = [...givenArray.data];
        break;
    }

    let modified_ratingArr = [];
    if (type !== "given") {
      let clean_ratingArr = parseRatings(ratingArr);
      modified_ratingArr = [...clean_ratingArr];
    } else {
      modified_ratingArr = [...ratingArr];
    }

    let name_ratingsArr = addName(
      modified_ratingArr,
      studentArr.data,
      "rating"
    );

    let finalRatingsArr = sortCombinedArray(name_ratingsArr, []);

    setRatingsArray(finalRatingsArr);
  };

  React.useEffect(() => {
    retrieveRatings();
  }, []);

  if (!ratingsArray) {
    return <p className={classes.center}>{emptyResponse}</p>;
  } else {
    return (
      <Container className={classes.container}>
        {ratingsArray.map((rating) => {
          return (
            <Grid container className={classes.center} key={rating.id}>
              {type !== "given" && <RatingCard rating={rating} />}
              {type === "given" && (
                <RatingUpdateCard
                  updateRating={retrieveRatings}
                  rating={rating}
                />
              )}
            </Grid>
          );
        })}
      </Container>
    );
  }
};

export { TutorRatings };
