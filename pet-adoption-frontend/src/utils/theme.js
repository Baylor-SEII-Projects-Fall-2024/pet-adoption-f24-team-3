import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';

// This file lets you modify the global theme of your project. Any changes here will affect all
// Material UI components throughout your website. Correspondingly, this is where you would set
// up your color palette, standard spacings, etc.
const themeOptions = {
    typography: {
        fontFamily: 'Roboto, Noto Sans, sans-serif',
        fontSize: 14,
        body2: {
            fontSize: 14
        }
    },
    shape: {
        borderRadius: 5,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    marginLeft: 4,
                    marginRight: 4,
                    marginTop: 4,
                    marginBottom: 4,
                },
                outlinedPrimary: {
                    border: '2px solid'
                },
                outlinedSecondary: {
                    border: '2px solid'
                },
                containedPrimary: {
                    backgroundColor: '#a3b18a',
                    color: '#fff',
                    '&:hover': {
                        backgroundColor: '#8e9d72', // Slightly darker green for hover
                    },
                },
                containedSecondary: {
                    backgroundColor: '#c5a5bf',
                    color: '#fff',
                    '&:hover': {
                        backgroundColor: '#af8ba5',
                    },
                },
                like: {
                    flex: 1,
                    height: "100%",
                    backgroundColor: "#e0fde0",
                    color: "#4c874c",
                    '&:hover': {
                        backgroundColor: '#b3f4b3',
                    },
                },
                dislike: {
                    flex: 1,
                    height: "100%",
                    backgroundColor: "#fde4e4",
                    color: "#bf3232",
                    '&:hover': {
                        backgroundColor: '#ffd0d0',
                    },
                },
            },
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    marginRight: 5,
                    marginLeft: 5,
                },
            },
        },
    },
    palette: {
        primary: {
            main: '#a3b18a', // Soft green
        },
        secondary: {
            main: '#c5a5bf', // Light lavender
        },
        background: {
            default: '#f0e6d6', // Light beige for the background
            paper: '#fafafa',   // Very light grey for card/paper backgrounds
        },
        text: {
            primary: '#333333', // Dark grey for primary text
            secondary: '#666666', // Lighter grey for secondary text
            white: '#fff',
            darkColor: '#5F4B59', // dark purple for some occasional text

        },
    }
};

export const theme = createTheme(themeOptions);

export const PetAdoptionThemeProvider = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
};