import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

export const AdminRoute = () => {
    const { user } = useContext(AuthContext)
    return user?.role === 'admin' ? <Outlet /> : <Navigate to="/home" replace />
}
