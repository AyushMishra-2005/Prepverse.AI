import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import SwipeableTemporaryDrawer from "../components/drawerComponent.jsx"

export function NavbarDemo() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "AI Hire", link: "/aiInterviews" },
    { name: "Internships", link: "/mockInterviewLandingPage" },
  ];

  const features = [
    { name: "Mock Interview", link: "/mockInterviewLandingPage" },
    { name: "Quiz", link: "/quiz" },
    { name: "Resume", link: "/resume" },
  ];

  const allNavFeatures = navItems.concat(features);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <div className="relative w-full z-50">
      <Navbar className="relative z-50">
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4 z-50">
            <button
              onClick={handleMenuOpen}
              className="px-4 py-2 rounded-md bg-white text-gray-800 font-medium shadow-sm hover:bg-gray-100 hover:shadow-md transition-all duration-200"
            >
              Features
            </button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: "#1f2937",
                  color: "white",
                  mt: 1,
                  zIndex: 1400,
                },
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              {features.map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    navigate(item.link);
                    handleMenuClose();
                  }}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#374151",
                    },
                  }}
                >
                  {item.name}
                </MenuItem>
              ))}
            </Menu>

            {!authUser && (
              <NavbarButton variant="secondary" onClick={() => navigate("/login")}>
                Login
              </NavbarButton>
            )}

            {authUser && (
              <>
                <Avatar
                  alt="User"
                  src={authUser.user.profilePicURL}
                  sx={{ width: 48, height: 48, cursor: "pointer" }}
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

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex gap-6 flex-row justify-center items-center mr-3">
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
              {authUser && (
                <>
                  <Avatar
                    alt="User"
                    src={authUser.user.profilePicURL}
                    sx={{ width: 48, height: 48, cursor: "pointer" }}
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
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
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
