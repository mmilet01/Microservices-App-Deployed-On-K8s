import React, { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import FeedOfMemories from "./memories/Feed/FeedOfMemories";
import UserProfile from "./users/user-profile/UserProfile";
import Header from "./components/Header/Header";
import Login from "./users/auth/Login/Login";
import Chat from "./chat/Chat";
import Register from "./users/auth/Register/Register";
import NewMemory from "./memories/CreateMemory/NewMemory";
import RequireAuth from "./components/requireAuth";

function App() {
  const [name, setName] = useState(localStorage.getItem("firstName"));
  const signOut = () => {
    setName(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("firstName");
  };

  const userLoggedIn = () => {
    setName(localStorage.getItem("firstName"));
  };
  return (
    <div className="App">
      <Router>
        <Header signOut={signOut} name={name} />
        <Switch>
          <RequireAuth
            exact
            path="/feed"
            component={FeedOfMemories}
          ></RequireAuth>
          <Route exact path="/login">
            <Login userLoggedIn={userLoggedIn} />
          </Route>
          <Route exact path="/register">
            <Register userLoggedIn={userLoggedIn} />
          </Route>
          <RequireAuth
            exact
            path="/profile/user/:id"
            component={UserProfile}
          ></RequireAuth>
          <RequireAuth exact path="/chat" component={Chat}></RequireAuth>
          <RequireAuth
            exact
            path="/memory/create"
            component={NewMemory}
          ></RequireAuth>
          <Redirect to="/feed" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
