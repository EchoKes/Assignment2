import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import { StudentDetails } from "./pages/StudentDetails";
import ErrorPage from "./pages/ErrorPage";
import GridViewIcon from "@mui/icons-material/GridView";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import StarIcon from "@mui/icons-material/Star";
import CommentIcon from "@mui/icons-material/Comment";

function App() {
  return (
    <>
      <Navbar>
        <NavItem location={"/dashboard"} icon={<GridViewIcon />} />
        <NavItem icon={<AccountBoxIcon />}>
          <DropDownMenu />
        </NavItem>
      </Navbar>
      <Router>
        {/* <nav>
        <Link to="dashboard">Dashboard</Link>
        <Link to="personal">Personal</Link>
      </nav> */}
        <Routes>
          <Route path="/" />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:studentid" element={<StudentDetails />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
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
  const DropDownItem = (props) => {
    return (
      <span href={props.location} className="menu-item">
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </span>
    );
  };

  return (
    <div className="dropdown">
      <DropDownItem leftIcon={<StarIcon />}>My Ratings</DropDownItem>
      <DropDownItem leftIcon={<CommentIcon />}>My Comments</DropDownItem>
    </div>
  );
};

export default App;
