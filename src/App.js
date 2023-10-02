import { Container } from "react-bootstrap";
import "./App.css";
import NavBar from "./components/Navbar";
import { Switch, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <NavBar />
      <Container>
        <Switch>
          <Route exact path="/" render={() => <h1>Home page</h1>} />
          <Route exact path="/signin" render={() => <h1>Sign in</h1>} />
          <Route exact path="/signup" render={() => <h1>Sign up</h1>} />
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
