import { Container } from "react-bootstrap";
import "./App.css";
import NavBar from "./components/Navbar";
import { Switch, Route } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import HomePage from "./pages/home/HomePage";
import AllHouseholds from "./pages/allhouseholds/AllHouseholds";
import NewHouseholdForm from "./pages/newhousehold/NewHousehold";
import EditHouseholdForm from "./pages/edithousehold/EditHousehold";

function App() {
  return (
    <div>
      <NavBar />
      <Container className="p-4">
        <Switch>
          <Route exact path="/" render={() => <HomePage />} />
          <Route exact path="/allhouseholds" render={() => <AllHouseholds />} />
          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route
            exact
            path="/newhousehold"
            render={() => <NewHouseholdForm />}
          />
          <Route
            exact
            path="/households/:id/edit"
            render={() => <EditHouseholdForm />}
          />
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
