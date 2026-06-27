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
                <div>Benvenuto nella Home {user.firstName}</div>
            )}
        </>
    )
}
export default Home