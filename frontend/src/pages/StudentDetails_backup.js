import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import {
  RatingCard,
  RatingCardEditable,
  HeadingCard,
} from "../components/RatingCardComponent";
import { Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

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

const client = axios.create({
  baseURL: `http://localhost:8181/api/v1/ratings`,
});

// function for getting ratings of student from api
const StudentRating = () => {
  const classes = useStyles();
  // EXPERIMENTAL tab
  const [tabValue, setTabValue] = React.useState(0);

  const handleTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const tutorid = localStorage.getItem("tutorid");
  const { studentid } = useParams();
  const [ratingsArray, setRatingsArray] = useState(() => {
    return null;
  }); // api student's ratings
  const [ratingFromTutor, setRatingFromTutor] = useState(() => {
    return "";
  }); // api student's rating from tutor

  React.useEffect(() => {
    client.get(`/${studentid}`).then((res) => {
      console.log(res.data);
      setRatingsArray(res.data);
    });
  }, [null]);

  React.useEffect(() => {
    client.get(`/${studentid}/${tutorid}`).then((res) => {
      console.log("rating from tutor is ran.");
      setRatingFromTutor(res.data);
    });
  }, [""]);

  // EXPERIMENTAL tab
  // return (
  //   <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
  //     <Tabs value={tabValue} onChange={handleTab} centered>
  //       <Tab label="Ratings">
  //         <p>hello im from ratings side</p>
  //       </Tab>
  //       <Tab label="Comments">
  //         <p>hello im from comments side</p>
  //       </Tab>
  //     </Tabs>
  //   </Box>
  // );

  if (!ratingsArray) {
    return (
      <Container className={classes.container}>
        <Grid className={classes.center}>
          <HeadingCard name={ratingFromTutor.receiverName} />
        </Grid>

        <p className={classes.center}>No ratings given yet :C</p>
        <Grid container className={classes.center}>
          <RatingCardEditable rating={ratingFromTutor} />
        </Grid>
      </Container>
    );
  } else {
    return (
      <Container className={classes.container}>
        <Grid className={classes.center}>
          <HeadingCard name={ratingFromTutor.receiverName} />
        </Grid>
        {ratingsArray.map((rating) => {
          return (
            <Grid container className={classes.center} key={rating.id}>
              {/* pass rating into cards component */}
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

export { StudentRating };
