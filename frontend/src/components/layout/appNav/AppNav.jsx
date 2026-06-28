import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, CalendarDays, User, Plus } from 'lucide-react';
import { Logo } from '../../logo/Logo';
import './AppNav.css';

// Questo array contiene le voci del menu
const navItems = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/statistics', label: 'Stats', icon: BarChart3 },
    { href: '/calendar', label: 'Calendar', icon: CalendarDays },
    { href: '/profile', label: 'Profile', icon: User },
];

export const BottomNav = () => {
    const location = useLocation();

    const leftItems = navItems.slice(0, 2);
    const rightItems = navItems.slice(2);

    return (
        <nav className="fixed-bottom d-lg-none z-3">
            <div className="bottom-nav-container d-flex justify-content-between align-items-center shadow-soft-lg mx-auto px-3">
                
                {/* LEFT ITEMS */}
                {leftItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link 
                            key={item.href} 
                            to={item.href} 
                            className={`nav-link-item ${isActive ? 'active' : ''}`}
                        >
                            <item.icon size={22} className="mb-1" fill={`${isActive ? '#4f4fde31' : 'transparent'}`} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}

                {/* ADD FOOD BUTTON */}
                <button 
                    className="btn  btn-primary-custom  add-food-btn shadow-soft rounded-circle d-flex justify-content-center align-items-center"
                    aria-label="Add food"
                    onClick={() => console.log("Opening food menu")}
                >
                    <Plus size={28} />
                </button>

                {/* RIGHT ITEMS */}
                {rightItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link 
                            key={item.href} 
                            to={item.href} 
                            className={`nav-link-item ${isActive ? 'active' : ''}`}
                        >
                            <item.icon size={22} className="mb-1" fill={`${isActive ? '#4f4fde31' : 'transparent'}`} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}

            </div>
        </nav>
    );
};

export const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="sidebar-container d-none d-lg-flex flex-column border-end  p-4">
            
            {/* LOGO */}
            <div className="mb-4 ms-2">
                <Logo  position='left'/>
            </div>

            {/* ADD FOOD BUTTON */}
            <button 
                className="btn btn-primary-custom radius-2xl d-flex justify-content-center align-items-center gap-2  py-2 shadow-soft sidebar-add-food-btn"
                onClick={() => console.log("Apro il menu per aggiungere cibo!")}
            >
                <Plus size={20} />
                <span className="fw-semibold">Add food</span>
            </button>

            {/* MENU LINKS */}
            <ul className="nav flex-column gap-2 flex-grow-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <li className="nav-item" key={item.href}>
                            <Link 
                                to={item.href} 
                                className={`sidebar-link ${isActive ? 'active' : ''} radius-2xl`}
                            >
                                <item.icon 
                                    size={20} 
                                    className="me-3" 
                                    fill={isActive ? '#4f4fde31' : 'transparent'} 
                                />
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {/* WIDGET */}
            <div className="mt-auto  radius-2xl p-3 text-center sidebar-widget">
                <p className="font-heading small fw-bold mb-1 text-primary-custom">Stay on track</p>
                <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: 0 }}>
                    Log every meal to keep your streak alive.
                </p>
            </div>
        </aside>
    );
};