import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Button, AppBar, Container, Typography, Toolbar, } from '@mui/material'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];


export default function HeaderBar(props) {
    const router = useRouter();

    console.log(props);

    const currentUserId = useSelector((state) => state.currentUser.currentUserId);
    const currentUserFullName = useSelector((state) => state.currentUser.currentUserFullName);

    const displayCurrentUser = () => {
        if (currentUserId) {
            return (
                <div>
                    <Typography>Welcome, {currentUserFullName}</Typography>
                    <Button variant='contained' color="secondary" onClick={() => router.push(`/profile/${currentUserId}`)} sx={{ width: 200 }}>Profile</Button>
                </div>
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

    return (
        <AppBar position="static" sx={{ maxHeight: "200px", }}>
            <Toolbar disableGutters>

                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {pages.map((page) => (
                        <Button
                            key={page}
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            {page}
                        </Button>
                    ))}
                </Box>
                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
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
                        {settings.map((setting) => (
                            <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}