import React from "react";
import Head from "next/head";
import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import styles from "@/styles/Home.module.css";
import PowerPointEmbed from "@/components/SlideViewer";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About</title>
      </Head>

      <main>
        <Box alignItems="center">
          <PowerPointEmbed></PowerPointEmbed>
        </Box>
      </main>
    </>
  );
}
