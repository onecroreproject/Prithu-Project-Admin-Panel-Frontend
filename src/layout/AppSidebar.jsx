// src/components/Sidebar/AppSidebar.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import PrithuLogo from "../Assets/Logo/PrithuLogo.png";
import {
  BoxCubeIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
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
      { name: "Admin Profile", path: "/", permission: null },
      { name: "ChildAdmin Creation", path: "/child/admin/page", permission: "canManageChildAdminsCreation" },
      { name: "ChildAdmin Permissions", path: "/childadmin/permission", permission: "canManageChildAdminsPermissions" },
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
  { icon: <ListIcon />, name: "Creator Profile", permission: "canManageCreators", subItems: [{ name: "Creator Details", path: "/creator/trending/table", permission: "canManageCreators" }] },
  { icon: <TableIcon />, name: "Feeds Info", permission: "canManageFeeds", subItems: [{ name: "Feed Upload", path: "/admin/upload/page", permission: "canManageFeeds" }] },
  {
    icon: <TableIcon />,
    name: "Subscriptions Info",
    permission: "canManageSettings",
    subItems: [
      { name: "Manage Subscriptions", path: "/subscription/page", permission: "canManageSettingsSubscriptions" },
    ],
  },
  { icon: <PageIcon />, name: "Pages", permission: null, subItems: [{ name: "Blank Page", path: "/blank", permission: null }, { name: "404 Error", path: "/error-404", permission: null }] },
];

const AppSidebar = ({ user }) => {
  const { isMobileOpen, setIsHovered, isHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  // 🔹 Filter menu based on role and grantedPermissions
  const filterMenu = (items) => {
    if (!user) return [];

    if (user.role === "Admin") return items; // Super Admin sees all

    // Child Admin sees only menus they have permission for
    return items
      .filter(item => !item.permission || user.grantedPermissions.includes(item.permission))
      .map(item => ({
        ...item,
        subItems: item.subItems?.filter(sub => !sub.permission || user.grantedPermissions.includes(sub.permission))
      }))
      // Remove parent menu if it has no visible subItems
      .filter(item => !item.subItems || item.subItems.length > 0);
  };

  const filteredNavItems = filterMenu(navItems);

  // 🔹 Open first submenu automatically if none is open
  // Track if initial auto-open has happened
const [initialOpenDone, setInitialOpenDone] = useState(false);

useEffect(() => {
  if (!initialOpenDone) {
    const firstWithSub = filteredNavItems.findIndex(item => item.subItems?.length > 0);
    if (firstWithSub !== -1) {
      setOpenSubmenu({ type: "main", index: firstWithSub });
    }
    setInitialOpenDone(true); // Only run once
  }
}, [filteredNavItems, initialOpenDone]);


  // 🔹 Update submenu height dynamically
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({ ...prev, [key]: subMenuRefs.current[key]?.scrollHeight || 0 }));
      }
    }
  }, [openSubmenu]);

const handleSubmenuToggle = (index, menuType) => {
  setOpenSubmenu(prev => (prev?.type === menuType && prev.index === index ? null : { type: menuType, index }));
};


  const renderMenuItems = (items, menuType) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems?.length ? (
            <button onClick={() => handleSubmenuToggle(index, menuType)} className="menu-item group flex items-center gap-3 cursor-pointer">
              <span className={`menu-item-icon-size flex-shrink-0 ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                {nav.icon}
              </span>
              {(isHovered || isMobileOpen) && (
                <>
                  <span className="menu-item-text">{nav.name}</span>
                  <ChevronDownIcon className={`ml-auto w-5 h-5 transition-transform duration-500 ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""}`} />
                </>
              )}
            </button>
          ) : (
            nav.path && (
              <Link to={nav.path} className={`menu-item group flex items-center gap-3 ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}>
                <span className={`menu-item-icon-size flex-shrink-0 ${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>{nav.icon}</span>
                {(isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )
          )}

          {nav.subItems?.length > 0 && (
            <div
              ref={(el) => { subMenuRefs.current[`${menuType}-${index}`] = el; }}
              className="overflow-hidden transition-[height,padding] duration-500"
              style={{
                height: openSubmenu?.type === menuType && openSubmenu?.index === index ? `${subMenuHeight[`${menuType}-${index}`]}px` : "0px",
                paddingTop: openSubmenu?.type === menuType && openSubmenu?.index === index ? "0.5rem" : "0px",
                paddingBottom: openSubmenu?.type === menuType && openSubmenu?.index === index ? "0.5rem" : "0px",
              }}
            >
              <ul className="mt-0 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link to={subItem.path} className={`menu-dropdown-item ${isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}>
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
   <aside
  className={`
    fixed top-0 left-0 h-screen flex flex-col bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 border-r border-gray-200 z-50
    transition-all duration-500 ease-in-out
    ${isHovered ? "w-[290px]" : "w-[90px]"} 
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
    lg:translate-x-0
    px-2 sm:px-4 md:px-5
  `}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
  {/* Logo */}
  <div
    className={`py-6 sm:py-8 flex items-center 
      ${isHovered || isMobileOpen ? "justify-start" : "justify-center"} 
      px-2 sm:px-4 `}
  >
    <Link to="/" className="flex items-center gap-3">
      <img
        src={PrithuLogo}
        alt="Logo"
        className="w-8 h-8 sm:w-20 sm:h-20 lg:w-12 lg:h-12"
      />
      {(isHovered || isMobileOpen) && (
        <p className="hidden sm:block text-base sm:text-lg lg:text-xl font-bold whitespace-nowrap">
          Prithu DashBoard
        </p>
      )}
    </Link>
  </div>

  {/* Scrollable Menu */}
  <div className="flex-1 overflow-y-auto no-scrollbar">
    <nav className="mb-6">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="mb-4 text-xs uppercase text-gray-400">
            {isHovered ? "Menu" : <HorizontaLDots />}
          </h2>
          {renderMenuItems(filteredNavItems, "main")}
        </div>
      </div>
    </nav>

    {/* Optional Widgets */}
    {(isHovered || isMobileOpen) && <SidebarWidget />}
  </div>
</aside>

  );
};

export default AppSidebar;
