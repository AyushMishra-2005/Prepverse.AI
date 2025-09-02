import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

const DrawerContainer = styled(Box)({
  width: 280,
  background: "rgba(20, 20, 20)", 
  backdropFilter: "blur(12px)",
  color: "white",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxShadow: "0 0 30px rgba(0, 0, 0, 0.5)", 
});

const MenuItem = styled(ListItemButton)(({ theme }) => ({
  borderRadius: "12px",
  margin: theme.spacing(0.5, 1.5),
  padding: theme.spacing(1.5, 2),
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    transform: "translateX(5px)",
  },
}));

const StyledListItemIcon = styled(ListItemIcon)({
  minWidth: "40px",
  color: "#6366f1",
});

const LogoutButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: "12px",
  margin: theme.spacing(1, 1.5, 2),
  padding: theme.spacing(1.5, 2),
  transition: "all 0.3s ease",
  backgroundColor: "rgba(244, 63, 94, 0.1)",
  "&:hover": {
    backgroundColor: "rgba(244, 63, 94, 0.2)",
    transform: "translateX(5px)",
  },
}));

const Header = styled(Box)({
  padding: "24px 20px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const Logo = styled("div")({
  fontSize: "24px",
  fontWeight: "700",
  background: "linear-gradient(45deg, #6366f1 0%, #8b5cf6 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

const Footer = styled(Box)({
  marginTop: "auto",
  padding: "16px 0",
});

export default function SwipeableTemporaryDrawer({ open, onClose, onOpen }) {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Profile", route: "/profilePage", icon: <InboxIcon /> },
    { label: "Settings", route: "/settings", icon: <MailIcon /> },
    { label: "My Interviews", route: "/interviews", icon: <InboxIcon /> },
  ];

  const list = (
    <DrawerContainer role="presentation">
      <Header>
        <Logo>Navigation</Logo>
      </Header>
      
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", mb: 1 }} />

      <Box sx={{ p: 1.5 }}>
        {menuItems.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => {
              navigate(item.route);
              onClose();
            }}
          >
            <StyledListItemIcon>{item.icon}</StyledListItemIcon>
            <ListItemText 
              primary={item.label} 
              primaryTypographyProps={{ 
                fontSize: "0.95rem",
                fontWeight: 500 
              }} 
            />
          </MenuItem>
        ))}
      </Box>

      <Footer>
        <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", mb: 2 }} />
        
        <LogoutButton onClick={() => {
          navigate("/logout");
          onClose();
        }}>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ 
              color: "#f43f5e", 
              fontWeight: 600,
              textAlign: "center"
            }}
          />
        </LogoutButton>
      </Footer>
    </DrawerContainer>
  );

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      ModalProps={{
        BackdropProps: {
          sx: { backgroundColor: "transparent !important" },
        },
      }}
      PaperProps={{
        sx: {
          bgcolor: "#000",
          color: "white",
          boxShadow: "0 0 40px rgba(0, 0, 0, 0.8)",
        },
      }}
    >
      {list}
    </SwipeableDrawer>
  );
}