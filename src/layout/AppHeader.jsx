import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";
import PrithuLogo from "../Assets/Logo/PrithuLogo.png";

const AppHeader = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isHovered, isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) toggleSidebar();
    else toggleMobileSidebar();
  };

  const toggleApplicationMenu = () => setApplicationMenuOpen(!isApplicationMenuOpen);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between w-full px-3 md:px-6 py-3 lg:py-4">
        {/* Sidebar toggle + Logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            className="flex items-center justify-center w-10 h-10 lg:w-11 lg:h-11 rounded-lg text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800"
          >
            {/* Hamburger / Close icon */}
            {isMobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6L18 18M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path
                  d="M0 1H16M0 6H16M0 11H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          {/* <Link to="/" className="flex items-center gap-2 lg:gap-3">
            <img src={PrithuLogo} alt="Logo" width={40} height={40} />
            {(isHovered || isMobileOpen) && <p className="text-xl font-bold">Prithu DashBoard</p>}
          </Link> */}
        </div>

        {/* Search bar */}
        <div
          className={`flex-1 max-w-full ml-4 transition-all duration-300 ease-in-out ${
            isHovered ? "lg:ml-6" : "lg:ml-4"
          }`}
        >
          <form className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search or type command..."
              className="w-full h-11 px-12 pr-14 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
              <span>⌘</span>
              <span>K</span>
            </button>
          </form>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-2 lg:gap-4 ml-4">
          <ThemeToggleButton />
          <NotificationDropdown />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
