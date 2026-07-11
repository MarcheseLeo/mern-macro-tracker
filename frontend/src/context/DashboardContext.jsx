import { createContext, useState } from 'react';

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const [selectedDate, setSelectedDate] = useState(today);
    const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
    const [targetMeal, setTargetMeal] = useState('breakfast');

    const [editingItem, setEditingItem] = useState(null)

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

    return (
        <DashboardContext.Provider value={{
            selectedDate, setSelectedDate,
            isAddFoodOpen, setIsAddFoodOpen,
            targetMeal, setTargetMeal,
            editingItem,setEditingItem,
            refreshTrigger, triggerRefresh
        }}>
            {children}
        </DashboardContext.Provider>
    );
};