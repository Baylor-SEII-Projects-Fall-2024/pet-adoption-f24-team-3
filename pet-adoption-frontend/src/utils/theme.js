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
            },
        },
    },
    palette: {
        primary: {
            light: '#C5A5BF',
            main: '#A77EA8',
            dark: '#5C4E7F',
            contrastText: '#344e41',
        },
        secondary: {
            light: '#eaf2d7',
            main: '#a3b18a',
            dark: '#588157',
            contrastText: '#252832',
        },
    },
};

export const theme = createTheme(themeOptions);

export const PetAdoptionThemeProvider = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
};