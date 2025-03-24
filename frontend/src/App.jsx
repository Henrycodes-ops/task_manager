import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import SplineContainer from "./components/spline";
import { SplineLoadProvider } from "./components/splineLoadProvider";
import Home from "./components/home";
import Login from "./components/login";
import Signup from "./components/signup";

export default function TaskManager() {
  return (
    <Router>
      <SplineLoadProvider>
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
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<h1>Not Found</h1>} />
        </Routes>
      </SplineLoadProvider>
    </Router>
  );
}
 