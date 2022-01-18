import React, { useState } from "react";
import axios from "axios";
import StudentCard from "../components/StudentCardComponent";
import { Grid, Container } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  gridContainer: {
    padding: "20px",
  },
});

const client = axios.create({
  baseURL: "http://localhost:8181/api/v1",
});

const Dashboard = () => {
  // reference style
  const classes = useStyles();
  // create states
  const [studentArray, setStudentArray] = useState(null); // api student details

  React.useEffect(() => {
    client.get("/students").then((res) => {
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
