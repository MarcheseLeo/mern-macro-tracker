import React, { createContext, useEffect, useState } from 'react'

export const ThemeContext = createContext()

export const ThemeProvider = ({children}) =>{
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
    const [accentColor, setAccentColor] = useState(localStorage.getItem('accentColor') || 'purple')

    useEffect(()=>{
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    useEffect(() => {
        document.documentElement.setAttribute('data-accent', accentColor)
        localStorage.setItem('accentColor', accentColor)
    }, [accentColor])

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    }

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme,
                accentColor,
                setAccentColor,
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}
