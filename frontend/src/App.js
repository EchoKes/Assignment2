import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { StudentDetails } from "./pages/StudentDetails";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
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
  );
}

export default App;
