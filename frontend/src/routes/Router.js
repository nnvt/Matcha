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
import Chat from "../pages/Chat";
import Verify from "../pages/Verify";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import User from "../pages/User";
import Settings from "../pages/Settings";
import PageUndefined from "../EmptyStates/500";
import Page404 from "../EmptyStates/404";


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
                    <Route path="/Policy" element={<PublicRoute restricted={false}><Policy /> </PublicRoute>} />
                    <Route path="/verify" element={<PublicRoute restricted={false}><Verify /> </PublicRoute>} />

                    {/* Private Routes */}
                    <Route path="/home" element={<PrivateRoute restricted={false}><Home /> </PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute restricted={false}><Profile /> </PrivateRoute>} />
                    <Route path="/profile/:username" element={<PrivateRoute restricted={false}><User /> </PrivateRoute>} />
                    <Route path="settings" element={<PrivateRoute restricted={false}><Settings /> </PrivateRoute>} />
                    <Route path="/steps" element={<PrivateRoute restricted={false}><CompleteProfile /> </PrivateRoute>} />
                    <Route path="/chat" element={<PrivateRoute restricted={false}><Chat /> </PrivateRoute>} />
                    <Route path="/undefined" element={<PrivateRoute restricted={false}><PageUndefined /> </PrivateRoute>} />

                    {/* Other Routes */}
                    <Route path="*" element={<Page404 />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default Routing;
