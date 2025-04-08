import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/login';
import Home from './components/home';
import Signup from './components/signup';
import Task from './components/task';
import GitHubCallback from './components/githubCallback';
import ForgotPassword from './components/ForgotPassword';
import Header from './components/header';
import SplineContainer from './components/spline';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <main className="appContainer">
        <Header />
        <SplineContainer />
      </main>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/task",
    element: <Task />,
  },
  {
    path: "/githubCallback",
    element: <GitHubCallback />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
 