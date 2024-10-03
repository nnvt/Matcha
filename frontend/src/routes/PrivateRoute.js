import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { checkTokenAction } from "../api/userActions.js";

const PrivateRoute = ({ component: Component, ...rest }) => {
    // Set initial state to handle loading and login status
    const [loading, setLoading] = useState(true);
    const [logged, setLogged] = useState(false);

    useEffect(() => {
        // Define async function to check token
        async function fetchData() {
            // Check if token is valid (true or false)
            const res = await checkTokenAction(localStorage.getItem("token"));

            // Update state based on the result
            setLogged(res);
            setLoading(false); // Set loading to false after checking the token
        }

        fetchData();
    }, []);

    // Render based on loading and logged states
    return (
        <Route
            {...rest}
            render={(props) =>
                loading ? (
                    // Show a loading spinner or null when loading
                    <div>Loading...</div> // Replace with a proper loader or spinner if needed
                ) : logged ? (
                    // If logged in, render the protected component
                    <Component {...props} />
                ) : (
                    // If not logged in, redirect to login
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default PrivateRoute;
