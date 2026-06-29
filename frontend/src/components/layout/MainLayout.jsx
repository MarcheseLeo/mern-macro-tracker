import { Outlet } from 'react-router-dom';
import { BottomNav, Sidebar } from './appNav/AppNav';
import './MainLayout.css'
import { AppFooter } from './appFooter/AppFooter';
export const MainLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100 bg-light">

            <Sidebar />

            <div className="flex-grow-1 d-flex flex-column main-wrapper">

                <main className="flex-grow-1 overflow-auto p-3  mb-5  main-content-area">
                    <div className="mx-auto" style={{ maxWidth: '800px' }}>
                        <Outlet />
                    </div>
                </main>

                {/* NAVBAR MOBILE */}
                <BottomNav />
                <AppFooter />
            </div>
        </div>
    )
}
