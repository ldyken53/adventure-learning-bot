import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { Start } from "./Start.jsx";
import "./App.css";

function App() {
  return (
    <Router basename="/">
      {/* <Start></Start> */}
      <div className="App">
        <header className="App-header">
          <Switch>
            <Route
              exact
              key="home"
              path="/home"
              render={() => (
                <>
                  <p>Welcome to Learn-A-Bot's Adventure Workshop!</p>
                  <Link
                    className="bg-blue-900 p-2 rounded"
                    id="start-button"
                    to={"/start"}
                  >
                    Begin Creating Your New Adventure
                  </Link>
                </>
              )}
            />
            <Route
              exact
              key="start"
              path="/start"
              render={(props) => <Start {...props} />}
            />
            <Redirect to="/home" />
          </Switch>
        </header>
      </div>
    </Router>
  );
}

export default App;
