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


    const getUser = async () => {
        setIsLoading(true)
        const token = localStorage.getItem('token')

        if (!token) {
            setIsLoading(false)
            return
        }

        try {
            const response = await api.get('/users/me')

            setUser(response.data.user || response.data) 
            setIsAuthorized(true)

        } catch (e) {
            console.error("Sessione scaduta o non valida", e)
            localStorage.removeItem('token')
            setUser(null)
            setIsAuthorized(false)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getUser()
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
                isLoading,
                isAuthorized
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
