import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Tooltip,
} from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../image/smartRentHeader.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { RentObjectForNavBar } from "../models/rentObjectModel";
import HomeIcon from "@mui/icons-material/Home";
import { useState, useEffect } from "react";
import { User } from "../models/userModel";

const pagesTenant = ["Pagrindinis", "Dokumentai", "Sąskaitos", "Pranešimai"];
const pagesLandLord = ["Pagrindinis", "Nuomos objektai", "Nuomininkai", "Sąskaitos", "Pranešimai"];
const settings = ["Profilis", "Atsijungti"];
let pages = ["","",""];

const ITEM_HEIGHT = 48;

interface AppBarProps {
  logOut: () => void;
  handleRentObjectChange: (rentObject: RentObjectForNavBar) => void;
  rentObjects?: RentObjectForNavBar[];
  meniuItems: string[];
  user: User;
}

const ResponsiveAppBar = (props: AppBarProps) => {
  const navigate = useNavigate();
  const [meniuItems, setMeniuItems] = useState<string[]>(props.meniuItems);
  const [rentObjects, setRentObjects] = useState<
    RentObjectForNavBar[] | undefined
  >(props.rentObjects);


  useEffect(()=> {
    if(props.user.userType === "tenant")
    {
      pages = pagesTenant;
    } else {
      pages = pagesLandLord;
    }
  },[]);


  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClickOnRentObject = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseOnRentObject = () => {
    setAnchorEl(null);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleNavButtonClick = (page: string) => {
    setAnchorElNav(null);
    handleRouting(page);
  };

  const handleNavUserButtonClick = (page: string) => {
    setAnchorElUser(null);
    handleRouting(page);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleRouting = (page: string) => {
    switch (page) {
      case "Dokumentai":
        navigate("/documents");
        break;
      case "Sąskaitos":
        navigate("/bills");
        break;
      case "Atsijungti":
        props.logOut();
        navigate("/");
        break;
      case "Profilis":
        navigate("/profile");
        break;
      case "Pranešimai":
        navigate("/messages");
        break;
      case "Pagrindinis":
        navigate("/home");
        break;
      case "Nuomininkai":
        navigate("/tenants");
        break;
      case "Nuomos objektai":
        navigate("/rentObjects")
        break;
    }
  };

  const handleRentObjectClick = (object: string) => {

    let rentObjectas: RentObjectForNavBar = {
      id: "",
      name: ""
    };

    rentObjects?.forEach((item) => 
    {
        if(item.name === object)
        {
          rentObjectas = item;
        }
    });

    props.handleRentObjectChange(rentObjectas);
  };

  return (
    <AppBar
      position="static"
      sx={{ background: "#646BF5", borderRadius: 5, boxShadow: 3 }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            <img src={logo} className="center" alt="logo" />
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              boxShadow: 3,
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleNavButtonClick}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    handleNavButtonClick(page);
                  }}
                >
                  <Button>{page}</Button>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => {
                  handleNavButtonClick(page);
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? "long-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClickOnRentObject}
            >
              <HomeIcon />
            </IconButton>
            {props.user.userType === "tenant" ? (
            <Menu
              id="long-menu"
              MenuListProps={{
                "aria-labelledby": "long-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseOnRentObject}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: "20ch",
                },
              }}
            >
              {meniuItems.map((option) => (
                <MenuItem
                  key={option}
                  selected={option === "Pyxis"}
                  onClick={handleCloseOnRentObject}
                >
                  <Button sx={{ textTransform: "none" }} onClick={() => {handleRentObjectClick(option);}}>{option}</Button>
                </MenuItem>
              ))}
            </Menu> ) : (<></>) }
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <AccountCircleIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Button
                    onClick={() => {
                      handleNavUserButtonClick(setting);
                    }}
                  >
                    {setting}
                  </Button>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
