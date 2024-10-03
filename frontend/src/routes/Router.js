import React from "react";
//Pages component
import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// eslint-disable-next-line
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
// import { GuardProvider, GuardedRoute } from 'react-router-guards';

const Routing = () => {
    return (
        <UserProvider>
            <Router>
                <Switch>
                    {/* Public Routes */}
                    <PublicRoute component={HomePage} path="/" exact />
                    {/*   Private Routes */}
                    {/* Other Routes */}
                </Switch>
            </Router>
        </UserProvider>
    );
};

export default Routing;
