import { Routes, Route } from 'react-router-dom';
import { SplineLoadProvider } from './components/splineLoadProvider';
import Login from './components/login';
import Home from './components/home';
import Signup from './components/signup';
import Task from './components/task';
import GitHubCallback from './components/githubCallback';
import ForgotPassword from './components/ForgotPassword';
import Header from './components/header';
import SplineContainer from './components/spline';

function App() {
  return (
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
        <Route path="/signup" element={<Signup />} />
        <Route path="/task" element={<Task />} />
        <Route path="/githubCallback" element={<GitHubCallback />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </SplineLoadProvider>
  );
}

export default App;
 