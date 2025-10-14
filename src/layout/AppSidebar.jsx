import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import PrithuLogo from "../Assets/Logo/PrithuLogo.png";
import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

const navItems = [
  { icon: <GridIcon />, name: "Dashboard", path: "/", permission: null },
  {
    icon: <UserCircleIcon />,
    name: "Admin",
    permission: "canManageChildAdmins",
    subItems: [
      { name: "Admin Profile", path: "/admin/profile/page", permission: null },
      { name: "ChildAdmin Creation", path: "/child/admin/page", permission: "canManageChildAdminsCreation" },
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    permission: "canManageUsers",
    subItems: [
      { name: "User Detail", path: "/user/profile/dashboard", permission: "canManageUsersDetail" },
      { name: "User Analytics", path: "/user/analitical/table", permission: "canManageUsersAnalytics" },
      { name: "User Feed Reports", path: "/user-reportinfo", permission: "canManageUsersFeedReports" },
    ],
  },
  {
    icon: <ListIcon />,
    name: "Creator Profile",
    permission: "canManageCreators",
    subItems: [
      { name: "Creator Details", path: "/creator/trending/table", permission: "canManageCreators" },
      { name: "Trending Creator", path: "/trending/creator", permission: "canTrendingCreators" }
    ]
  },
  { icon: <TableIcon />, name: "Feeds Info", permission: "canManageFeeds", subItems: [
      { name: "Feed Upload", path: "/admin/upload/page", permission: "canManageFeeds" }
    ] 
  },
  {
    icon: <TableIcon />,
    name: "Subscriptions Info",
    permission: "canManageSettings",
    subItems: [
      { name: "Manage Subscriptions", path: "/subscription/page", permission: "canManageSettingsSubscriptions" },
    ],
  },
  { icon: <PageIcon />, name: "Pages", permission: null, subItems: [
      { name: "Blank Page", path: "/blank", permission: null }, 
      { name: "404 Error", path: "/error-404", permission: null }
    ] 
  },
];

const AppSidebar = ({ user }) => {
  const { isMobileOpen, setIsHovered, isHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  // Filter menu based on permissions
  const filterMenu = (items) => {
    if (!user) return [];
    if (user.role === "Admin") return items;
    return items
      .filter((item) => !item.permission || user.grantedPermissions.includes(item.permission))
      .map((item) => ({
        ...item,
        subItems: item.subItems?.filter(
          (sub) => !sub.permission || user.grantedPermissions.includes(sub.permission)
        ),
      }))
      .filter((item) => !item.subItems || item.subItems.length > 0);
  };

  const filteredNavItems = filterMenu(navItems);

  // Handle submenu toggle
  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prev) =>
      prev?.type === menuType && prev.index === index ? null : { type: menuType, index }
    );
  };

  // Update submenu height dynamically
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  // Sidebar width animation
  const sidebarVariants = {
    collapsed: {
      width: "85px",
      transition: { type: "spring", stiffness: 180, damping: 26, duration: 0.5, ease: "easeInOut" },
    },
    expanded: {
      width: "280px",
      transition: { type: "spring", stiffness: 180, damping: 26, duration: 0.5, ease: "easeInOut" }
    },
  };

  // Fade/slide animation for text (logo, labels)
  const textVariants = {
    hidden: { opacity: 0, x: -12, transition: { duration: 0.2 } },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  // Close submenus when sidebar collapses
  const handleMouseLeave = () => {
    setIsHovered(false);
    setOpenSubmenu(null);
  };

  // Render Menu Items
  const renderMenuItems = (items, menuType) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        const isSubmenuOpen =
          openSubmenu?.type === menuType && openSubmenu?.index === index;
        const key = `${menuType}-${index}`;

        return (
          <li key={nav.name}>
            {nav.subItems?.length ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group flex items-center gap-3 cursor-pointer w-full transition-all duration-200 ${
                  isSubmenuOpen ? "text-brand-500" : ""
                }`}
                tabIndex={0}
              >
                <span
                  className={`menu-item-icon-size flex-shrink-0 transition-colors duration-300 ${
                    isSubmenuOpen ? "menu-item-icon-active" : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                <AnimatePresence>
                  {(isHovered || isMobileOpen) && (
                    <motion.span
                      key={nav.name}
                      variants={textVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="flex-1 text-left"
                    >
                      {nav.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                {(isHovered || isMobileOpen) && (
                  <motion.div
                    animate={{ rotate: isSubmenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDownIcon className="w-5 h-5" />
                  </motion.div>
                )}
              </button>
            ) : (
              <Link
                to={nav.path}
                className={`menu-item group flex items-center gap-3 transition-all duration-200 ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size flex-shrink-0 ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                <AnimatePresence>
                  {(isHovered || isMobileOpen) && (
                    <motion.span
                      variants={textVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="menu-item-text"
                    >
                      {nav.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )}
            {/* Submenu Animation */}
            <AnimatePresence>
              {isSubmenuOpen && (
                <motion.div
                  key={"submenu"}
                  ref={(el) => {
                    subMenuRefs.current[key] = el;
                  }}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: subMenuRefs.current[key]?.scrollHeight || "auto",
                    opacity: 1,
                  }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
                    opacity: { duration: 0.2 },
                  }}
                  className="overflow-hidden"
                >
                  <ul className="mt-1 space-y-1 ml-9">
                    {nav.subItems?.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          className={`menu-dropdown-item ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );

  return (
    <motion.aside
      layout
      className={`
        fixed top-0 left-0 h-screen flex flex-col 
        bg-white dark:bg-gray-900 text-gray-900 border-r border-gray-200
        z-50 transition-all ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 px-3
      `}
      variants={sidebarVariants}
      animate={isHovered ? "expanded" : "collapsed"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        boxShadow: "0 1px 10px rgba(0,0,0,.07)"
      }}
    >
      {/* Logo + Title section */}
      <div
        className={`py-6 flex items-center transition-all duration-500 ${
          isHovered || isMobileOpen ? "justify-start" : "justify-center"
        }`}
      >
        <Link to="/" className="flex items-center gap-3">
          <img
            src={PrithuLogo}
            alt="Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-10 lg:h-10"
          />
          <AnimatePresence>
            {(isHovered || isMobileOpen) && (
              <motion.p
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="hidden sm:block text-base lg:text-lg font-semibold whitespace-nowrap"
              >
                Prithu Dashboard
              </motion.p>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="mb-4 text-xs uppercase text-gray-400 flex items-center justify-between">
                {isHovered ? "Menu" : <HorizontaLDots className="mx-auto" />}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>
          </div>
        </nav>
        <AnimatePresence>
          {(isHovered || isMobileOpen) && <SidebarWidget />}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

export default AppSidebar;
