import React from "react";
import { Navigate } from "react-router-dom";
import { isLogin } from "../utils/Verifications";

// Sử dụng `children` để bao bọc các components cần render
const PublicRoute = ({ children, restricted }) => {
    return isLogin() && restricted ? <Navigate to="/home" /> : children;
};

export default PublicRoute;
