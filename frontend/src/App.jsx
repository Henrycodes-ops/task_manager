
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./header";
import Task from "./task";
import SplineContainer from "./spline";
import Home from "./home";

export default function TaskManager() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <main className="appContainer">
              <Header />
              <Home />
              <SplineContainer />
            </main>
          }
        />
        <Route path="/task" element={<Task />} />
      </Routes>
    </Router>
  );
}
