import React from "react";
import Head from "next/head";
import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import TeamMemberCard from "@/components/TeamMemberCard";
import FeatureCard from "@/components/FeatureCard";
import styles from "@/styles/Home.module.css";

const people = [
  {
    member: "Logan Rigdon",
    role: "Project Manager",
    imgLink: "team/logan.JPG",
    githubLink: "https://github.com/Renzenar",
  },
  {
    member: "John (August) Rothpletz",
    role: "Design Engineer",
    imgLink: "team/august.jpg",
    githubLink: "https://github.com/Jarpletz",
  },
  {
    member: "Samuel Fries",
    role: "Project Librarian",
    imgLink: "team/sam.jpeg",
    githubLink: "https://github.com/SamuelF2",
  },
  {
    member: "Brendon Newton",
    role: "Requirements Engineer",
    imgLink: "team/brendon.jpeg",
    githubLink: "https://github.com/brendonnewt",
  },
  {
    member: "Icko Iben",
    role: "Assurance Engineer",
    imgLink: "team/icko.jpeg",
    githubLink: "https://github.com/ickoxii",
  },
];

const features = [
  "Streamlined and engaging user experience",
  "Customizable pet recommendation engine",
  "Live chat and inbox",
  "Browsing and posting events",
  "Security measures",
  "The G.R.I.E.F.F.F engine",
];

export default function AboutPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Head>
        <title>About</title>
      </Head>

      <main>
        {/* Logo Slide */}
        <Box
          sx={{
            width: "100%",
            height: "auto",
          }}
        >
          <img
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
            }}
            src={"/slides/slide1.jpg"}
          />
        </Box>

        {/* Team Section */}
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            marginTop: "4%",
            marginBottom: "4%",
          }}
        >
          Meet Our Team
        </Typography>

        {/* Grid Container for Team Cards */}
        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="center"
          sx={{ width: "100%", margin: "auto" }}
        >
          {people.map((person, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <a
                href={person.githubLink}
                style={{
                  padding: 0,
                  margin: 0,
                }}
              >
                <TeamMemberCard
                  member={person.member}
                  role={person.role}
                  imgLink={person.imgLink}
                />
              </a>
            </Grid>
          ))}
        </Grid>

        {/* What We Offer Section */}
        <Typography
          variant="h3"
          align="center"
          sx={{
            marginTop: "6%",
            marginBottom: "4%",
          }}
        >
          What We Offer
        </Typography>
        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="center"
          sx={{ width: "100%", margin: "auto", marginBottom: "10%" }}
        >
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard feature={feature}></FeatureCard>
            </Grid>
          ))}
        </Grid>
      </main>
    </Box>
  );
}
