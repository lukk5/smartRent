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
import { RentObject } from "../models/rentObjectModel";
import HomeIcon from "@mui/icons-material/Home";
import { useState, useEffect } from "react";
import { User } from "../models/userModel";
import { getByTenantId } from "../service/rentObjectService";

const pagesTenant = ["Pagrindinis", "Dokumentai", "Sąskaitos"];
const pagesLandLord = [
  "Pagrindinis",
  "Nuomos objektai",
  "Sąskaitos",
  "Dokumentai",
];
const settings = ["Profilis", "Atsijungti"];
let pages = ["", "", ""];

const ITEM_HEIGHT = 48;

interface AppBarProps {
  logOut: () => void;
  user: User;
  handleRentObjectChange: (object: RentObject) => void;
}

const ResponsiveAppBar = (props: AppBarProps) => {
  const navigate = useNavigate();
  const [meniuItems, setMeniuItems] = useState<string[]>([]);
  const [rentObjects, setRentObjects] = useState<RentObject[] | null>([]);
  const [defaultSet, setDefaultSet] = useState<boolean>(false);

  useEffect(() => {
    if (props.user.userType === "tenant") {
      pages = pagesTenant;
    } else {
      pages = pagesLandLord;
    }
  }, []);

  useEffect(() => {
    getTenantRentObjects();
  }, [props]);

  useEffect(() => {
    setMeniu(rentObjects);
  }, [rentObjects]);

  const getTenantRentObjects = async () => {
    if (props.user.userType !== "tenant") return;
    const data = await getByTenantId(props.user.id);

    if (!defaultSet) {
      props.handleRentObjectChange(data[0]);
    }

    setRentObjects(data);
  };

  const setMeniu = (items: RentObject[] | null) => {
    let itemsForMeniu: string[] = [];

    if (items === null) return null;

    items.forEach((item) => {
      itemsForMeniu.push(item.name);
    });

    setMeniuItems(itemsForMeniu);
  };

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
        navigate("/rentObjects");
        break;
    }
  };

  const handleRentObjectClick = (object: string) => {
    setDefaultSet(true);
    rentObjects?.forEach((item) => {
      if (item.name === object) {
        props.handleRentObjectChange(item);
      }
    });
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
          <Box sx={{ flexGrow: 1, display: { xs: "center", md: "flex" } }}>
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
          { props.user.userType === "tenant" ? (<Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Nuomos objektas">
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClickOnRentObject}
                hidden={props.user.userType !== "tenant"}
              >
                <HomeIcon />
              </IconButton>
            </Tooltip>
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
                    <Button
                      sx={{ textTransform: "none" }}
                      onClick={() => {
                        handleRentObjectClick(option);
                      }}
                    >
                      {option}
                    </Button>
                  </MenuItem>
                ))}
              </Menu>
            ) : (
              <></>
            )}
          </Box>)
          : (<></>)
          }
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Vartotojo nustatymai">
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
