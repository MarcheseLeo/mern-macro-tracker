import { useEffect, useContext, useState } from "react"
import { useLocation, useNavigate, useNavigation } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { Loader2 } from "lucide-react"
import { BlurredBackground } from "../../components/ui/blurredBackground/BlurredBackground"

export const OauthSuccessPage = () => {
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const token = searchParams.get('token')

    const navigate = useNavigate()
    const { login } = useContext(AuthContext)


    useEffect(() => {
        const handleLogin = async () => {
            if (token) {
                await login(token)
                navigate('/home')
            } else {
                navigate('/login')
            }
        }

        const timer = setTimeout(() => {
            handleLogin()
        }, 2000)

        return () => clearTimeout(timer)
    }, [token, navigate, login])
    return (
        <main className="d-flex justify-content-center align-items-center min-vh-100 px-3 position-relative overflow-hidden bg-background">

            <BlurredBackground variant="single"/>

            <div className="text-center position-relative z-1" style={{ maxWidth: '400px' }}>
                <Loader2
                    className="animate-spin mb-4 mx-auto"
                    size={48}
                    color="var(--primary)"
                />
                <h2 className="font-heading fw-bold">Authentication in progress...</h2>
                <p className="text-muted small mb-0">
                    We're preparing your account. You'll be redirected shortly.
                </p>
            </div>
        </main>
    )
}
