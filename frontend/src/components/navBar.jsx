import React, { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Navbar, {
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../components/ui/resizable-navbar.jsx";
import { useAuth } from "../context/AuthProvider.jsx";
import SwipeableTemporaryDrawer from "../components/drawerComponent.jsx";
import { Sun, Moon } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

export function NavbarDemo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "/home2" },
    { name: "Find Internship", link: "/internships" },
    
    { name: "Interview", link: "/candidate/dashboard" },
    { name: "Dashboard", link: "/company/dashboard" },
    
  ];

  const features = [
    { name: "Mock Interview", link: "/mockInterviewLandingPage" },
    { name: "Quiz", link: "/quiz" },
    { name: "Resume", link: "/resume" },
  ];

  const allNavFeatures = navItems.concat(features);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const toggleDrawer = (open) => (event) => {
    if (event?.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) return;
    setDrawerOpen(open);
  };

  return (
    <div className="relative w-full z-50">
      <Navbar
        className={
          theme === "dark"
            ? "bg-[#141414] border-b border-[#2A2A2A]"
            : "bg-white border-b border-[#EAEAEA]"
        }
      >
        <NavBody>
          {/* Logo */}
          <Link to="/">
            <NavbarLogo theme={theme} />
          </Link>

          {/* Desktop Nav */}
          <NavItems items={navItems} theme={theme} currentPath={location.pathname} />

          {/* Right Actions */}
          <div className="flex items-center gap-3 z-50">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-colors ${
                theme === "dark"
                  ? "border-[#FF6900] text-[#FF6900] hover:bg-[#FF6900] hover:text-white"
                  : "border-[#FF6900] text-[#FF6900] hover:bg-[#FF6900] hover:text-white"
              }`}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Features Dropdown */}
            <button
              onClick={handleMenuOpen}
              className={`px-4 py-2 rounded-md font-medium shadow-sm transition-all duration-200 ${
                theme === "dark"
                  ? "bg-[#1f2937] text-white hover:bg-[#273244]"
                  : "bg-white text-gray-800 border border-[#EAEAEA] hover:bg-gray-100"
              }`}
            >
              Features
            </button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                  color: theme === "dark" ? "#ffffff" : "#111827",
                  border: theme === "dark" ? "1px solid #374151" : "1px solid #E5E7EB",
                },
              }}
            >
              {features.map((item) => (
                <MenuItem
                  key={item.name}
                  onClick={() => {
                    handleMenuClose();
                    navigate(item.link);
                  }}
                  sx={{
                    "&:hover": {
                      backgroundColor: theme === "dark" ? "#374151" : "#F3F4F6",
                    },
                  }}
                >
                  {item.name}
                </MenuItem>
              ))}
            </Menu>

            {/* Auth */}
            {!authUser ? (
              <button
                onClick={() => navigate("/login")}
                className="border border-[#FF6900] text-[#FF6900] font-bold py-2 px-5 rounded-full hover:bg-[#FF6900] hover:text-white transition"
              >
                Login
              </button>
            ) : (
              <>
                <Avatar
                  alt="User"
                  className="bg-transparent text-white"
             
                  src={authUser.user?.profilePicURL}
                  sx={{ width: 44, height: 44, cursor: "pointer" }}
                  onClick={toggleDrawer(true)}
                />
                <SwipeableTemporaryDrawer
                  open={drawerOpen}
                  onClose={toggleDrawer(false)}
                  onOpen={toggleDrawer(true)}
                />
              </>
            )}
          </div>
        </NavBody>

        {/* Mobile Nav */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo theme={theme} />

            <div className="flex gap-4 items-center mr-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full border ${
                  theme === "dark"
                    ? "border-[#FF6900] text-[#FF6900] hover:bg-[#FF6900] hover:text-white"
                    : "border-[#FF6900] text-[#FF6900] hover:bg-[#FF6900] hover:text-white"
                }`}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {authUser && (
                <>
                  <Avatar
                    alt="User"
                    src={authUser.user?.profilePicURL}
                    sx={{ width: 40, height: 40, cursor: "pointer" }}
                    onClick={toggleDrawer(true)}
                  />
                  <SwipeableTemporaryDrawer
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                  />
                </>
              )}

              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} theme={theme}>
            {allNavFeatures.map((item) => {
              const isActive = location.pathname === item.link;
              return (
                <a
                  key={item.name}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${
                    isActive
                      ? "text-[#FF6900] font-semibold"
                      : theme === "dark"
                      ? "text-neutral-300"
                      : "text-neutral-700"
                  }`}
                >
                  {item.name}
                </a>
              );
            })}

            <div className="flex w-full flex-col gap-3 mt-2">
              {authUser ? (
                <NavbarButton
                  onClick={() => navigate("/logout")}
                  variant="primary"
                  className="w-full"
                >
                  Logout
                </NavbarButton>
              ) : (
                <NavbarButton
                  onClick={() => navigate("/login")}
                  variant="primary"
                  className="w-full"
                >
                  Login
                </NavbarButton>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}

export default NavbarDemo;
