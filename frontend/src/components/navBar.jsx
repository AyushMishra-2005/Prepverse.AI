import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  Navbar,
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
import { useContext } from "react";

export function NavbarDemo() {
  const navigate = useNavigate();
  const { authUser } = useAuth();

  const { theme, toggleTheme } = useContext(ThemeContext);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  /** --------- Nav links --------- */
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Home2", link: "/home2" },
    { name: "AI Hire", link: "/aiInterviews" },
    { name: "Internships", link: "/internships" },
  ];

  const features = [
    { name: "Mock Interview", link: "/mockInterviewLandingPage" },
    { name: "Quiz", link: "/quiz" },
    { name: "Resume", link: "/resume" },
  ];

  const allNavFeatures = navItems.concat(features);

  /** --------- MUI Menu + Drawer --------- */
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const toggleDrawer = (open) => (event) => {
    if (event?.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) return;
    setDrawerOpen(open);
  };

  return (
    <div className="relative w-full z-50">
      <Navbar
        className={`relative z-50 transition-colors duration-300 ${
          theme === "dark"
            ? "bg-[#141414] border-b border-[#2A2A2A]"
            : "bg-white border-b border-[#EAEAEA]"
        }`}
      >
        <NavBody>
          {/* Left: logo */}
          <div className="flex items-center gap-2">
  <Link
    to="/"
    className={`hidden sm:flex items-center space-x-1 px-3 py-1 text-xl font-bold tracking-tight transition-transform duration-200 hover:scale-105 ${
      theme === "dark" ? "text-white" : "text-[#1A1A1A]"
    }`}
  >
    <span className="text-sm text-[#FF6900]">◆</span>
    <span className={theme === "dark" ? "text-white" : "text-[#1A1A1A]"}>
      Prepverse.
    </span>
    <span className="text-[#FF6900]">AI</span>
  </Link>
</div>


          {/* Middle: desktop nav items */}
          <NavItems items={navItems} />

          {/* Right: actions */}
          <div className="flex items-center gap-3 z-50">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`p-2 rounded-full border transition-colors ${
                theme === "dark"
                  ? "border-[#FF6900] text-[#FF6900] hover:bg-[#FF6900] hover:text-white"
                  : "border-[#FF6900] text-[#FF6900] hover:bg-[#FF6900] hover:text-white"
              }`}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Features dropdown trigger */}
            <button
              onClick={handleMenuOpen}
              className={`px-4 py-2 rounded-md font-medium shadow-sm transition-all duration-200 ${
                theme === "dark"
                  ? "bg-[#1f2937] text-white hover:bg-[#273244] hover:shadow-md"
                  : "bg-white text-gray-800 hover:bg-gray-100 hover:shadow-md border border-[#EAEAEA]"
              }`}
            >
              Features
            </button>

            {/* MUI Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                  color: theme === "dark" ? "#ffffff" : "#111827",
                  mt: 1,
                  zIndex: 1400,
                  border: theme === "dark" ? "1px solid #374151" : "1px solid #E5E7EB",
                },
              }}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              {features.map((item, index) => (
                <MenuItem
                  key={index}
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

            {/* Login / Avatar + Drawer */}
            {!authUser ? (
              <button
                onClick={() => navigate("/login")}
                className="bg-transparent border border-[#FF6900] text-[#FF6900] font-poppins font-bold py-2 px-5 rounded-full hover:bg-[#FF6900] hover:text-white transition-colors"
              >
                Login
              </button>
            ) : (
              <>
                <Avatar
                  alt="User"
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

        {/* ========== Mobile Nav ========== */}
        <MobileNav>
          <MobileNavHeader>
            <div className="flex items-center gap-2">
              <NavbarLogo />
              <span
                className={`text-base font-semibold ${
                  theme === "dark" ? "text-white" : "text-[#1A1A1A]"
                }`}
              >
                Prepverse.AI
              </span>
            </div>

            <div className="flex gap-4 items-center mr-3">
              {/* Mobile theme toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`p-2 rounded-full border transition-colors ${
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

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {allNavFeatures.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`relative ${
                  theme === "dark" ? "text-neutral-300" : "text-neutral-700"
                }`}
              >
                <span className="block">{item.name}</span>
              </a>
            ))}

            <div className="flex w-full flex-col gap-3 mt-2">
              {authUser ? (
                <NavbarButton
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/logout");
                  }}
                  variant="primary"
                  className="w-full"
                >
                  Logout
                </NavbarButton>
              ) : (
                <NavbarButton
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/login");
                  }}
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
