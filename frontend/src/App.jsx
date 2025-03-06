
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./header";
import Task from "./task";
import SplineContainer from "./spline";

export default function TaskManager() {
  return (
    <main className="appContainer">
      <Router>
        <Header />
        <Switch>
          <Route path="/task" component={Task} />
        </Switch>
        <SplineContainer />
      </Router>
    </main>
  );
}
