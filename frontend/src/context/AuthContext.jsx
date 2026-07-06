import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
        setIsAuthorized(false)
    }

    const checkToken = (token) => {
        try {
            const decoded = jwtDecode(token)
            const isExpired = decoded.exp * 1000 < Date.now()

            if (isExpired) {
                logout()
                return false
            }

            setUser(decoded)
            setIsAuthorized(true)
            return true
        } catch (e) {
            logout()
            return false
        }
    }

    const getUser = async () => {
        setIsLoading(true)
        const token = localStorage.getItem('token')

        if (!token) {
            setIsLoading(false)
            return
        }

        const isValid = checkToken(token)
        if (!isValid) {
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
