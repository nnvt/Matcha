// PrivateRoute.jsx
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkTokenAction } from "../api/userActions";

const PrivateRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [logged, setLogged] = useState(false);
    const location = useLocation();

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

    if (loading) {
        return <div>Loading...</div>; // Replace with a proper loader if desired
    }

    if (!logged) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;
