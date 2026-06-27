import { useContext } from "react"
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";


export const GuestRoute = () => {
    const { isAuthorized, isLoading } = useContext(AuthContext)

    return (
        <>
            {isLoading ? (
                <></>
            ) : (
                <>
                    {isAuthorized ? (
                    <Navigate to="/home" replace />
                ) : (
                    <Outlet />
                )}
                </>
            )}
        </>
    )
}
