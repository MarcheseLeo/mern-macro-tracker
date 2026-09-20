import React, { createContext, useState, useEffect } from "react";
import api from "../services/api"


export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (e) { console.log(e) }

        localStorage.removeItem('token')
        setUser(null)
        setIsAuthorized(false)
        if (window.location.pathname !== '/login') {
            window.location.href = '/login'
        }
    }

    const clearSession = () => {
        localStorage.removeItem('token')
        setUser(null)
        setIsAuthorized(false)
        setIsLoading(false)
    }


    const getUser = async () => {
        setIsLoading(true)

        try {
            // A 401 from /users/me is handled by the API interceptor. It performs
            // exactly one refresh for all concurrent requests, including reloads
            // where localStorage no longer contains an access token.
            const response = await api.get('/users/me')

            setUser(response.data.user || response.data) 
            setIsAuthorized(true)

        } catch (e) {
            console.error("Sessione scaduta o non valida", e)
            clearSession()
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        const handleSessionExpired = () => {
            clearSession()
            if (window.location.pathname !== '/login') {
                window.location.assign('/login')
            }
        }

        window.addEventListener('auth:expired', handleSessionExpired)
        return () => window.removeEventListener('auth:expired', handleSessionExpired)
    }, [])

    const login = async (token) => {
        localStorage.setItem('token', token)
        await getUser()
    }



    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                refreshUser: getUser,
                setUser,
                isLoading,
                isAuthorized
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
