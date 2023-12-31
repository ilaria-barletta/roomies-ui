import Container from "react-bootstrap/Container";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import GroceryLists from "./pages/groceries/GroceryLists";
import GroceryList from "./pages/groceries/GroceryList";
import NewGroceryList from "./pages/groceries/NewGroceryList";
import EditGroceryList from "./pages/groceries/EditGroceryList";
import NewItemForm from "./pages/groceries/items/NewItem";
import EditItemForm from "./pages/groceries/items/EditItem";
import WelcomePage from "./pages/welcome/WelcomePage";
import NotFound from "./pages/notfound/NotFound";
import NewHouseholdMember from "./pages/newhouseholdmember/NewHouseholdMember";
import NewComment from "./pages/groceries/comments/NewComment";
import EditComment from "./pages/groceries/comments/EditComment";

function App() {
  return (
    <div>
      <NavBar />
      <Container className="p-4">
        <Switch>
          <Route exact path="/" render={() => <HomePage />} />
          <Route exact path="/welcome" render={() => <WelcomePage />} />
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
          <Route
            exact
            path="/households/:id/groceries"
            render={() => <GroceryLists />}
          />
          <Route
            exact
            path="/grocerylists/:id"
            render={() => <GroceryList />}
          />
          <Route
            exact
            path="/grocerylists/:id/edit"
            render={() => <EditGroceryList />}
          />
          <Route
            exact
            path="/grocerylists/:id/newitem"
            render={() => <NewItemForm />}
          />
          <Route
            exact
            path="/grocerylists/:id/newcomment"
            render={() => <NewComment />}
          />
          <Route
            exact
            path="/grocerylists/:id/comments/:commentId/edit"
            render={() => <EditComment />}
          />
          <Route
            exact
            path="/grocerylists/:id/items/:itemId/edit"
            render={() => <EditItemForm />}
          />
          <Route
            exact
            path="/households/:id/newgrocerylist"
            render={() => <NewGroceryList />}
          />
          <Route
            exact
            path="/households/:id/newmember"
            render={() => <NewHouseholdMember />}
          />
          <Route render={() => <NotFound />} />
        </Switch>
      </Container>
      <ToastContainer />
    </div>
  );
}

export default App;
