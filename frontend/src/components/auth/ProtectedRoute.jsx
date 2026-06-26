import { useContext } from "react"
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

export const ProtectedRoute = () => {
    const token = localStorage.getItem('token');

    try {
        if (!token) throw new Error("No token");

        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) throw new Error("Token expired");

        return <Outlet />;
    } catch (e) {
        console.log(e)
        return <Navigate to="/login" replace />;
    }
}
