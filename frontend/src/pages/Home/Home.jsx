import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Navigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

const Home = () => {
    const { user, isLoading } = useContext(AuthContext)
    return (
        <>
            {!user ? (
                <div>Caricamento </div>
            ) : (
                <div className="container py-4">
                    <h1 className="h4 fw-bold font-heading">
                        Ciao, {user?.firstName || 'Utente'}! 👋
                    </h1>
                    <p className="text-muted small">This is your dashboard</p>
                </div>
            )}
        </>
    )
}
export default Home