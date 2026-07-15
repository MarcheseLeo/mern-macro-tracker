import { useContext } from "react"
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import { BlurredBackground } from "../ui/blurredBackground/BlurredBackground";
import { Loader2 } from "lucide-react";


export const ProtectedRoute = () => {
    const { isAuthorized, isLoading } = useContext(AuthContext)

    return (
        <>
            {isLoading ? (
                <main className="d-flex justify-content-center align-items-center min-vh-100 px-3 position-relative overflow-hidden bg-background">

                    <BlurredBackground variant="single" />

                    <div className="text-center position-relative z-1" style={{ maxWidth: '400px' }}>
                        <Loader2
                            className="animate-spin mb-4 mx-auto"
                            size={48}
                            color="var(--primary)"
                        />
                        <h2 className="font-heading fw-bold text-dark">Loading...</h2>
                        <p className="text-muted small mb-0">
                            You'll be redirected shortly.
                        </p>
                    </div>
                </main>
            ) : (
                <>
                    {isAuthorized ? (
                        <Outlet />
                    ) : (
                        <Navigate to="/login" replace />
                    )}
                </>
            )}
        </>
    )

}
