import React from "react";
// Pages component
import HomePage from "../pages/Homepage";
import { UserProvider } from "../Reducers/Context";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// eslint-disable-next-line
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const Routing = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<PublicRoute restricted={false}><HomePage /> </PublicRoute>} />
                    {/* Private Routes */}
                    {/* Other Routes */}
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default Routing;
