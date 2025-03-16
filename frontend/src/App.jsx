import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/header";
// import Task from "./components/task";
import SplineContainer from "./components/spline";
// import Home from "./components/home";
import Login from "./components/Signup";
import { SplineLoadProvider } from "./components/splineLoadProvider";

export default function TaskManager() {
  return (
    <SplineLoadProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={ 
              <main className="appContainer">
                <Header />
                <SplineContainer />
              </main>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </SplineLoadProvider>
  );
}
