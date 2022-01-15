import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

const baseURL = 'http://localhost:8181/api/v1';

function App() {
  const getRatings = () => {
    axios.get(baseURL + '/ratings')
    .then(res => {
      console.log(res.data)
    }).catch(err => {
      console.log(err)
    })
  }  
  return (
    <>
      <div>
        <h1>test axios api</h1>
        <button onClick={getRatings}>Get Ratings</button>
      </div>
    </>
  );
}

export default App;
