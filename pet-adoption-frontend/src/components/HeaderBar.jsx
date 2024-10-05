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

import userService from "@/utils/services/userService";


const settings = ['Profile', 'Logout'];


export default function HeaderBar(props) {
    const router = useRouter();
    const { logOut } = userService();

    console.log(props);

    const currentUserId = useSelector((state) => state.currentUser.currentUserId);
    const currentUserFullName = useSelector((state) => state.currentUser.currentUserFullName);



    const pages = [
        {
            name: "Pets",
            route: "/pets"
        },
        {
            name: "Events",
            route: "/events"
        },
        {
            name: "Adoption Centers",
            route: "/centers"
        },
    ];

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
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

    const displayCurrentUser = () => {
        if (currentUserId) {
            return (
                <Box sx={{ display: "flex", alignItems: "center " }}>
                    <Typography>Welcome, {currentUserFullName}</Typography>
                    <Tooltip title="View Profile">
                        <IconButton
                            onClick={handleOpenUserMenu}
                            sx={{ p: 0 }}
                        >
                            <Avatar alt="Remy Sharp" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" />
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
                            router.push(`/profile/${currentUserId}`);
                            handleCloseUserMenu();
                        }}>
                            <Typography sx={{ textAlign: 'center' }}>Profile</Typography>
                        </MenuItem>
                        <MenuItem key={"logout"} onClick={() => {
                            logoutUser();
                        }}>
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
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: "center" }}>
                        <Box
                            sx={{ display: { xs: 'none', md: 'flex' }, alignItems: "center" }}
                            onClick={() => router.push("/")}>
                            <Image
                                src="/WOOF_Logo.jpg" // Since the image is in the public folder, use the root path
                                alt="WOOF Logo"
                                width={75}
                                height={75}
                            />
                            <Typography
                                variant='h3'
                                color='text.secondary'
                                sx={{ marginLeft: "10px" }} >WOOF</Typography>
                        </Box>

                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={() => router.push(page.route)}
                                sx={{ my: 2, color: 'white', display: 'block' }}
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
        </AppBar>
    );
}