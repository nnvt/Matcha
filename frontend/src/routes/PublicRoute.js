import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isLogin } from "../helper/Verifications";

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                isLogin() ? <Redirect to="/home" /> : <Component {...props} />
            }
        />
    );
};

export default PublicRoute;
