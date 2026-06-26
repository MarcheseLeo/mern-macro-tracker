import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const getUser = async () => {
        setIsLoading(true)
        const token = localStorage.getItem('token')
        if (!token) {
            setIsLoading(false)
            return
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (response.status === 401) {
                logout()
            }
            if (response.ok) {
                const data = await response.json()
                setUser(data)
            } else {
                localStorage.removeItem('token')
                setUser(null)
            }
        } catch (e) {
            console.error("Errore fetch user", e)
            setUser(null)
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

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}