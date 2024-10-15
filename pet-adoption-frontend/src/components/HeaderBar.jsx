import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Button, AppBar, Container, Typography, Toolbar, } from '@mui/material'
import Image from 'next/image';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { AccountBox, Logout, Pets, CalendarMonth, Cottage } from "@mui/icons-material";

import userService from "@/utils/services/userService";


export default function HeaderBar(props) {
    const router = useRouter();
    const { logOut } = userService();
    const currentUserId = useSelector((state) => state.currentUser.currentUserId);
    const currentUserFullName = useSelector((state) => state.currentUser.currentUserFullName);
    const currentUserType = useSelector((state) => state.currentUser.currentUserType);

    const pages = [
        {
            name: "Pets",
            route: "/pets",
            icon: <Pets />
        },
        {
            name: "Events",
            route: "/events",
            icon: <CalendarMonth />
        },
        {
            name: "Adoption Centers",
            route: "/centers",
            icon: <Cottage />
        },
    ];

    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logoutUser = () => {
        handleCloseUserMenu();
        if (window.confirm('Are you sure you want to log out?')) {
            logOut();
            router.push(`/`);
        }
    }

    let styles = {
        headerBox: {
            display: { xs: 'none', md: 'flex' },
            alignItems: "center"
        },
        leftBox: {
            flexGrow: 1,
            display: { xs: 'none', md: 'flex' },
            alignItems: "center"
        },
        clickBox: {
            display: { xs: 'none', md: 'flex' },
            alignItems: "center",
            cursor: "pointer"
        },
        headerText: {
            my: 2,
            mx: 2,
            fontSize: "1.1em",
            display: 'flex',
            color: 'white',
        },
    };

    const displayCurrentUser = () => {
        if (currentUserId) {
            return (
                <Box sx={styles.headerBox}>
                    <Typography sx={styles.headerText} color='text.white'>Welcome, {currentUserFullName}!</Typography>
                    <Tooltip title="View Profile">
                        <IconButton
                            onClick={handleOpenUserMenu}
                            sx={{ p: 1 }}
                        >
                            <Avatar alt="Remy Sharp" src={`http://localhost:8080/api/images/users/${currentUserId}/profile`} />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem key={"profile"} onClick={() => {
                            if (currentUserType == "Center") {
                                router.push(`/centers/${currentUserId}`);
                            } else {
                                router.push(`/profile/${currentUserId}`);
                            }
                            handleCloseUserMenu();
                        }}>
                            <AccountBox></AccountBox>
                            <Typography sx={{ textAlign: 'center' }}>Profile</Typography>
                        </MenuItem>
                        <MenuItem key={"logout"} onClick={() => {
                            logoutUser();
                        }}>
                            <Logout></Logout>
                            <Typography sx={{ textAlign: 'center' }}>Log Out</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            );
        }
        else {
            return (
                <div>
                    <Button variant='contained' onClick={() => router.push(`/login`)} >Log In</Button>
                    <Button variant='contained' color="secondary" onClick={() => router.push(`/register`)}>Sign Up</Button>
                </div>

            );
        }
    }

    return (
        <AppBar position="static">
            <Container maxWidth="x1">
                <Toolbar disableGutters>
                    <Box sx={styles.leftBox}>
                        <Box
                            sx={styles.clickBox}
                            onClick={() => router.push("/")}>
                            <Image
                                src="/WOOF_Logo.png" // Since the image is in the public folder, use the root path
                                alt="WOOF Logo"
                                width={100}
                                height={60}
                            />
                            <Typography
                                variant='h3'
                                color='text.darkColor'
                                sx={{ marginLeft: "10px" }} >WOOF</Typography>
                        </Box>

                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={() => router.push(page.route)}
                                sx={styles.headerText}
                                startIcon={page.icon}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        {displayCurrentUser()}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar >
    );
}