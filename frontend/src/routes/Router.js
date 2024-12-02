import React from "react";
// Pages component
import HomePage from "../pages/Homepage";
import { UserProvider } from "../Reducers/Context";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// eslint-disable-next-line
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPass from "../pages/ForgotPass";
import Policy from "../components/Policy";
import CompleteProfile from "../pages/CompleteProfile";

const Routing = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<PublicRoute restricted={false}><HomePage /> </PublicRoute>} />
                    <Route path="/login" element={<PublicRoute restricted={false}><Login /> </PublicRoute>} />
                    <Route path="/register" element={<PublicRoute restricted={false}><Register /> </PublicRoute>} />
                    <Route path="/newpassword" element={<PublicRoute restricted={false}><ForgotPass /> </PublicRoute>} />
                    <Route path="/policy" element={<PublicRoute restricted={false}><Policy /> </PublicRoute>} />

                    {/* Private Routes */}
                    <Route path="/steps" element={<PrivateRoute restricted={false}><CompleteProfile /> </PrivateRoute>} />
                    <Route path="/steps" element={<PrivateRoute restricted={false}><CompleteProfile /> </PrivateRoute>} />
                    {/* Other Routes */}
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default Routing;
