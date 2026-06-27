import { useContext } from "react"
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";


export const ProtectedRoute = () => {
    const { isAuthorized,isLoading } = useContext(AuthContext)

    return (
        <>
            {isLoading ? (
                <></>
            ) : (
                <>
                    {isAuthorized ? (
                    <Outlet/>
                ) : (
                    <Navigate to="/login" replace />
                )}
                </>
            )}
        </>
    )

}
