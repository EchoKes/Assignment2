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
import Cookies from "js-cookie";

function App() {
  // retrieve id from authentication package 3.1
  // retrieve connect.sid from cookie first then attach to get request
  const [id, setId] = useState("");
  React.useEffect(() => {
    axios({
      method: "get",
      url: "http://10.31.11.11:8090/session",
      withCredentials: true,
      headers: { Cookie: `connect.sid=${Cookies.get("connect.sid")}` },
    }).then((res) => {
      console.log(res);
      console.log("this is res data: ");
      console.log(res.data);
      // let uid = res.data["userID"];
      // let uType = res.data["usertype"];
      // console.log(uType);
      // if (uType === "tutor") {
      //   setId(uid);
      //   console.log(
      //     `user type of ${uType} with id of ${uid} attempting to enter tutor's dashboard..`
      //   );
      // } else {
      //   window.alert("Unauthorised! Only tutors allowed.");
      //   window.history.back();
      // }
    });
    // localStorage.setItem("tutorid", id);
  }, []);
  localStorage.setItem("tutorid", "T01234567A");
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
  const tutorid = localStorage.getItem("tutorid");
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
