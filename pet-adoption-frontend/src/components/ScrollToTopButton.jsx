import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const ScrollToTopButton = () => {
    const [showButton, setShowButton] = useState(false);

    // Show the button only if the user has scrolled down at least one full page
    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > window.innerHeight);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            {showButton && (
                <IconButton
                    onClick={scrollToTop}
                    sx={{
                        position: "fixed",
                        left: "1%",
                        bottom: "5%",
                        width: "2.5em",
                        height: "2.5em",
                        bgcolor: "primary.main",
                        "&:hover": {
                            bgcolor: "primary.dark",
                        },
                        boxShadow: 3,
                    }}
                    aria-label="Scroll to top"
                >
                    <ArrowUpwardIcon sx={{ fontSize: "45px" }} />
                </IconButton>
            )}
        </>
    );
};

export default ScrollToTopButton;
