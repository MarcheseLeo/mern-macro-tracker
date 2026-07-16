import { Outlet } from 'react-router-dom';
import { BottomNav, Sidebar } from './appNav/AppNav';
import './MainLayout.css'
import { AppFooter } from './appFooter/AppFooter';
import { AddFoodSheet } from '../dashboard/addFoodSheet/AddFoodSheet';
import { DashboardProvider, DashboardContext } from '../../context/DashboardContext';
import { useContext } from 'react';
import { NotificationProvider } from '../../context/NotificationContext';

const LayoutContent = () => {
    const { isAddFoodOpen, setIsAddFoodOpen, targetMeal, selectedDate, triggerRefresh } = useContext(DashboardContext);

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Sidebar />
            <div className="flex-grow-1 d-flex flex-column main-wrapper">
                <main className="flex-grow-1 overflow-auto p-3 mb-5 main-content-area">
                    <div className="mx-auto" style={{ maxWidth: '800px' }}>
                        <Outlet />
                    </div>
                </main>
                <BottomNav />
                <AppFooter />
            </div>

            <AddFoodSheet
                open={isAddFoodOpen}
                onClose={() => setIsAddFoodOpen(false)}
                defaultMeal={targetMeal}
                selectedDate={selectedDate}
                onFoodAdded={() => triggerRefresh()}
            />
        </div>
    )
}

export const MainLayout = () => {
    return (
        <DashboardProvider>
            <NotificationProvider>
                <LayoutContent />
            </NotificationProvider>
        </DashboardProvider>
    )
}
