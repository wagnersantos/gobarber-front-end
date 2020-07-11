import React from "react";
import { Switch } from "react-router-dom";

import Route from "./Route";

import Dashboard from "../pages/Dashboard";
import ForgotPassword from "../pages/ForgotPassword";
import Profile from "../pages/Profile";
import ResetPassword from "../pages/ResetPassword";
import SignIn from "../pages/Signin";
import SignUp from "../pages/Signup";

const routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/signup" component={SignUp} />
    <Route path="/forgot-password" component={ForgotPassword} />
    <Route path="/reset-password" component={ResetPassword} />

    <Route path="/dashboard" component={Dashboard} isPrivate />
    <Route path="/profile" component={Profile} isPrivate />
  </Switch>
);

export default routes;
