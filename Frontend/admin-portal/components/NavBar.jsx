import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import iiitLogo from "/iiit-logo.png";
import { Link } from "react-router-dom";

export default function NavBar() {
  const auth = true;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ flexGrow: 1, maxHeight: 20, zIndex: 2 }}>
        <Link hrefLang="en" to="/">
          <Box width={"fit-content"}>
            <img
              src={iiitLogo}
              alt="IIIT Logo"
              style={{ width: 100, height: 40 }}
            />
          </Box>
        </Link>
        <Box sx={{ width: 100 }} />
        <Typography
          variant="h6"
          component="div"
          align="left"
          sx={{ flexGrow: 1 }}
        >
          Recruitment Portal
        </Typography>
        {auth && (
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}
