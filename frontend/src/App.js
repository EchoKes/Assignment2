import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import Dashboard from "./pages/Dashboard";
import { StudentDetails } from "./pages/StudentDetails";
import { TutorRatings } from "./pages/TutorRatings";
import { TutorComments } from "./pages/TutorComments";
import ErrorPage from "./pages/ErrorPage";
import GridViewIcon from "@mui/icons-material/GridView";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import StarIcon from "@mui/icons-material/Star";
import CommentIcon from "@mui/icons-material/Comment";
import getUID from "./components/Auth";

function App() {
  // localStorage.setItem("tutorid", "T01234567A");

  return (
    <Router>
      <Navbar>
        <NavItem location={"/dashboard"} icon={<GridViewIcon />} />
        <NavItem icon={<AccountBoxIcon />}>
          <DropDownMenu />
        </NavItem>
      </Navbar>
      <Routes>
        <Route path="/" />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:studentid" element={<StudentDetails />} />
        <Route path="/personal/ratings/:tutorid" element={<TutorRatings />} />
        <Route path="/personal/comments/:tutorid" element={<TutorComments />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

const Navbar = (props) => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav"> {props.children} </ul>
    </nav>
  );
};

const NavItem = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <li className="nav-item">
      <a
        href={props.location}
        className="icon-button"
        onClick={() => setOpen(!open)}
      >
        {props.icon}

        {open && props.children}
      </a>
    </li>
  );
};

const DropDownMenu = () => {
  let tutorid = getUID;
  const navigate = useNavigate();
  const DropDownItem = (props) => {
    return (
      <span onClick={() => navigate(props.location)} className="menu-item">
        <span className="icon-button">{props.leftIcon}</span>
        &nbsp;&nbsp;{props.children}
      </span>
    );
  };

  return (
    <div className="dropdown">
      <DropDownItem
        location={`/personal/ratings/${tutorid}`}
        leftIcon={<StarIcon />}
      >
        My Ratings
      </DropDownItem>
      <DropDownItem
        location={`/personal/comments/${tutorid}`}
        leftIcon={<CommentIcon />}
      >
        My Comments
      </DropDownItem>
    </div>
  );
};

export default App;
