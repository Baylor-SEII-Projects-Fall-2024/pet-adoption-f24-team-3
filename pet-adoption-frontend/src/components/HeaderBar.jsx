import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import {
  AppBar,
  Button,
  Checkbox,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import {
  AccountBox,
  CalendarMonth,
  Cottage,
  HeartBroken,
  Inbox,
  Leaderboard,
  Logout,
  Pets,
} from "@mui/icons-material";

import userService from "@/utils/services/userService";
import guiltService from "@/utils/services/guiltService";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function HeaderBar(props) {
  const router = useRouter();
  const { logOut, getUserInfo } = userService();
  const { saveGriefToCookie } = guiltService();
  const [isOwner, setIsOwner] = React.useState(false);

  const currentUserId = useSelector((state) => state.currentUser.currentUserId);

  const currentUserFullName = useSelector(
    (state) => state.currentUser.currentUserFullName
  );

  const currentUserType = useSelector(
    (state) => state.currentUser.currentUserType
  );

  const dispatch = useDispatch();

  const [grief, setGrief] = React.useState(null);

  const pages = [
    {
      name: "Pets",
      route: "/pets",
      icon: <Pets />,
    },
    {
      name: "Events",
      route: "/events",
      icon: <CalendarMonth />,
    },
    {
      name: "Adoption Centers",
      route: "/centers",
      icon: <Cottage />,
    },
    {
      name: "Leaderboard",
      route: "/leaderboard",
      icon: <Leaderboard />,
    },
  ];

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleGriefClick = () => {
    const newGriefSetting = !grief;
    setGrief(newGriefSetting);
    dispatch({ type: 'SET_GRIEF_ENGINE_PREFERENCE', payload: newGriefSetting });
    saveGriefToCookie(newGriefSetting); // Update cookies
  };

  const logoutUser = () => {
    handleCloseUserMenu();
    if (window.confirm("Are you sure you want to log out?")) {
      logOut();
      router.push(`/`);
    }
  };

  /**
    * Check cookies and mount and set grief preference accordingly.
    *
    * I wanted to use my setGriefPreferences function but some funky
    * stuff was happening when I load from cookies and dispatch to
    * redux directly. Namely, the checkbox and actual grief engine
    * functionality was out of sync if the page was reloaded.
    * */
  React.useEffect(() => {
    const savedGrief = Cookies.get('griefEnginePreference');
    const griefPreference = savedGrief === 'true';
    setGrief(griefPreference);
    dispatch({ type: 'SET_GRIEF_ENGINE_PREFERENCE', payload: griefPreference });

    // If the grief preference is undefined, set default and save to cookie
    if (savedGrief === undefined) {
      saveGriefToCookie(true); // Default to true
      dispatch({ type: 'SET_GRIEF_ENGINE_PREFERENCE', payload: true });
    }

    // Fetch user info for owner status
    if (currentUserId) {
      const fetchAccountType = async () => {
        try {
          const userTypeResult = await getUserInfo(currentUserId);
          setIsOwner(userTypeResult.accountType !== "Center");
        } catch (error) {
          console.error("User information could not be found for user", currentUserId);
        }
      }
      fetchAccountType();
    } else {
      // Usually when on loading page or after logging out
      setGrief(false);
      setIsOwner(false);
    }
  }, [currentUserId, dispatch, getUserInfo, saveGriefToCookie]);

  let styles = {
    headerBox: {
      display: { xs: "flex", md: "flex" },
      alignItems: "center",
    },
    leftBox: {
      flexGrow: 1,
      display: { xs: "none", md: "flex" },
      alignItems: "center",
    },
    clickBox: {
      display: { xs: "none", md: "flex" },
      alignItems: "center",
      cursor: "pointer",
    },
    headerText: {
      my: 2,
      mx: 2,
      fontSize: "1.1em",
      display: "flex",
      color: "white",
    },
  };

  const displayCurrentUser = () => {
    if (currentUserId) {
      return (
        <Box sx={styles.headerBox}>
          <Typography sx={styles.headerText} color="text.white">
            Welcome, {currentUserFullName}!
          </Typography>
          <Tooltip title="View Profile">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 1 }}>
              <Avatar
                alt="Current User Profile Photo"
                src={`${apiUrl}/api/images/users/${currentUserId}/profile`}
              />
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
            <MenuItem
              key={"profile"}
              onClick={() => {
                if (currentUserType == "Center") {
                  router.push(`/centers/${currentUserId}`);
                } else {
                  router.push(`/profile/${currentUserId}`);
                }
                handleCloseUserMenu();
              }}
            >
              <AccountBox></AccountBox>
              <Typography sx={{ textAlign: "center" }}>Profile</Typography>
            </MenuItem>
            {isOwner && (
              <MenuItem
                key={"grief"}
                onChange={handleGriefClick}
              >
                <HeartBroken
                />
                <Box>
                  <Checkbox
                    checked={grief}
                    sx={{
                      color: grief ? 'black' : 'default', // Black color when checked, default when unchecked
                      '&.Mui-checked': {
                        color: 'black', // Ensures the checkmark is black when checked
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: "1em", // Adjust size if needed
                      },
                    }}
                  />
                </Box>
              </MenuItem>
            )}
            <MenuItem
              key={"inbox"}
              onClick={() => {
                router.push("/messaging");
              }}
            >
              <Inbox></Inbox>
              <Typography sx={{ textAlign: "center" }}>Inbox</Typography>
            </MenuItem>
            <MenuItem
              key={"logout"}
              onClick={() => {
                logoutUser();
              }}
            >
              <Logout></Logout>
              <Typography sx={{ textAlign: "center" }}>Log Out</Typography>
            </MenuItem>
          </Menu>
        </Box>
      );
    } else {
      return (
        <div>
          <Button variant="contained" onClick={() => router.push(`/login`)}>
            Log In
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => router.push(`/register`)}
          >
            Sign Up
          </Button>
        </div>
      );
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="x1">
        <Toolbar disableGutters>
          <Box sx={styles.leftBox}>
            <Box sx={styles.clickBox} onClick={() => router.push("/")}>
              <Image
                src="/WOOF_Logo.png" // Since the image is in the public folder, use the root path
                alt="WOOF Logo"
                width={100}
                height={60}
              />
              <Typography
                variant="h3"
                color="text.darkColor"
                sx={{ marginLeft: "10px" }}
              >
                WOOF
              </Typography>
            </Box>


            {pages.map((page) => {
              if (page.name === "Leaderboard" && !isOwner) {
                return null;
              } else if (page.name === "Leaderboard" && !grief && isOwner) {
                return null;
              }
              return (
                <Button
                  key={page.name}
                  onClick={() => router.push(page.route)}
                  sx={styles.headerText}
                  startIcon={page.icon}
                >
                  {page.name}
                </Button>
              )
            })}
          </Box>
          <Box sx={{ flexGrow: 0 }}>{displayCurrentUser()}</Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
