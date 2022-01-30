import React, { useState } from "react";
import axios from "axios";
import StudentCard from "../components/Students";
import { Grid, Container } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  gridContainer: {
    padding: "20px",
  },
});

const { REACT_APP_ALLSTUDENTS_URL } = process.env;

const client = axios.create({
  baseURL: REACT_APP_ALLSTUDENTS_URL,
});

const Dashboard = () => {
  // reference style
  const classes = useStyles();
  // create states
  const [studentArray, setStudentArray] = useState([]); // api student details

  React.useEffect(() => {
    client.get("").then((res) => {
      console.log(res.data);
      setStudentArray(res.data);
    });
  }, []);

  if (!studentArray) return null;

  return (
    <Container className={classes.gridContainer}>
      <Grid container spacing={4}>
        {studentArray.map((student) => {
          return (
            <Grid key={student.id} item xs={12} sm={6} md={4} zeroMinWidth>
              <StudentCard id={student.id} name={student.name}></StudentCard>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Dashboard;
