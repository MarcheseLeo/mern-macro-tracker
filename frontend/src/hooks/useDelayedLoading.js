import { useEffect, useState } from 'react'

export const useDelayedLoading = (isLoading, delay = 500) => {
    const [showLoading, setShowLoading] = useState(false)

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            setShowLoading(isLoading)
        }, isLoading ? delay : 0)

        return () => {
            clearTimeout(loadingTimeout)
        }
    }, [isLoading, delay])

    return showLoading
}
