import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, CalendarDays, User, Plus } from "lucide-react";
import { Logo } from "../../logo/Logo";
import "./AppNav.css";
import { DashboardContext } from "../../../context/DashboardContext";
import { useContext } from "react";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/profile", label: "Profile", icon: User },
];

const tips = [
  {
    title: "Stay on track 📈",
    description: "Log every meal to keep your streak alive",
  },
  {
    title: "Stay hydrated 🥤",
    description: "Remember to hit your 8 glasses of water today!",
  },
  {
    title: "Quick tip 💡",
    description: "You can modify a meal food details, by tapping on it.",
  },
  {
    title: "Make it simple ⚡",
    description: "Search a food quickly using the barcode scanner function.",
  },
  {
    title: "Customize your experience 🌛",
    description: "Use Dark Mode to enjoy the App in dark",
  },
  {
    title: "Do not disturb 🍵",
    description:
      "You can disable notifications in profile settings, if you prefer.",
  },
  {
    title: "Consistency is key 🗝️",
    description:
      "Missed a meal log? Don't stress! Just pick up where you left off.",
  },
  {
    title: "Custom Recipes 🧑‍🍳",
    description:
      "Cook often? Save your favorite meals as Custom Foods for 1-click logging.",
  },
  {
    title: "Protein Power 💪",
    description:
      "Try to spread your protein intake evenly across all your daily meals.",
  },
  {
    title: "Fiber is your friend 🥦",
    description:
      "Tracking veggies helps you reach your daily fiber goal. It keeps you full longer!",
  },
  {
    title: "Review your progress 📈",
    description:
      "Check the Stats tab at the end of the week to see your macro averages.",
  },
  {
    title: "Rest and Recover 😴",
    description:
      "Remember that good sleep is just as important as hitting your macro goals.",
  },
];

export const BottomNav = () => {
  const location = useLocation();
  const { setIsAddFoodOpen, setTargetMeal } = useContext(DashboardContext);

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
              className={`nav-link-item ${isActive ? "active" : ""}`}
            >
              <item.icon
                size={22}
                className="mb-1"
              />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* ADD FOOD BUTTON */}
        <button
          className="btn  btn-primary-custom  add-food-btn shadow-soft rounded-circle d-flex justify-content-center align-items-center"
          aria-label="Add food"
          onClick={() => {
            setTargetMeal("breakfast");
            setIsAddFoodOpen(true);
          }}
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
              className={`nav-link-item ${isActive ? "active" : ""}`}
            >
              <item.icon
                size={22}
                className="mb-1"
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export const Sidebar = () => {
  const i = Math.floor(Math.random() * tips.length);
  const location = useLocation();
  const { setIsAddFoodOpen, setTargetMeal } = useContext(DashboardContext);

  return (
    <aside className="sidebar-container d-none d-lg-flex flex-column border-end  p-4">
      {/* LOGO */}
      <div className="mb-4 ms-2">
        <Logo position="left" />
      </div>

      {/* ADD FOOD BUTTON */}
      <button
        className="btn btn-primary-custom radius-2xl d-flex justify-content-center align-items-center gap-2  py-2 shadow-soft sidebar-add-food-btn"
        onClick={() => {
          setTargetMeal("breakfast");
          setIsAddFoodOpen(true);
        }}
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
                className={`sidebar-link ${isActive ? "active" : ""} radius-2xl`}
              >
                <item.icon
                  size={20}
                  className="me-3"
                />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* WIDGET */}
      <div className="mt-auto  radius-2xl p-3 text-center sidebar-widget">
        <p className="font-heading small fw-bold mb-1 text-primary-custom">
          {tips[i].title}
        </p>
        <p
          className="text-muted"
          style={{ fontSize: "0.75rem", marginBottom: 0 }}
        >
          {tips[i].description}
        </p>
      </div>
    </aside>
  );
};
