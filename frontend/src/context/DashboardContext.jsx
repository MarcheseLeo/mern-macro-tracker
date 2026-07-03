import { createContext, useState } from 'react';

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
    const today = new Date().toISOString().split('T')[0];
    
    const [selectedDate, setSelectedDate] = useState(today);
    const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
    const [targetMeal, setTargetMeal] = useState('breakfast');
    
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

    return (
        <DashboardContext.Provider value={{
            selectedDate, setSelectedDate,
            isAddFoodOpen, setIsAddFoodOpen,
            targetMeal, setTargetMeal,
            refreshTrigger, triggerRefresh
        }}>
            {children}
        </DashboardContext.Provider>
    );
};