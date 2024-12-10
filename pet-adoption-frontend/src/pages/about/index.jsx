import React from "react";
import Head from "next/head";
import {
  Box,
  Container,
  Grid,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import TeamMemberCard from "@/components/TeamMemberCard";
import FeatureCard from "@/components/FeatureCard";
import styles from "@/styles/Home.module.css";

const teamMembers = [
  {
    member: "Logan Rigdon",
    role: "Project Manager",
    imgLink: "team/logan.JPG",
    githubLink: "https://github.com/Renzenar",
    description: "Leads our mission to connect pets with loving homes",
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
  // ... other team members with descriptions
];

const features = [
  {
    title: "Smart Match Technology",
    description:
      "Our advanced pet recommendation engine helps find your perfect companion",
    icon: "🎯",
  },
  {
    title: "Real-Time Communication",
    description:
      "Connect instantly with shelters and pet owners through our live chat system",
    icon: "💬",
  },
  {
    title: "Community Events",
    description:
      "Join and create pet-focused events and build connections in your local community",
    icon: "📅",
  },
  {
    title: "Secure Platform",
    description: "Security measures to protect your information and privacy",
    icon: "🔒",
  },
  {
    title: "G.R.I.E.F.F.F Engine",
    description: "Our proprietary system to increase user engagement",
    icon: "⚡",
  },
];

const missionStatement = {
  title: "Our Mission",
  content:
    "We're dedicated to creating lasting connections between pets and loving homes through innovative technology and compassionate service.",
};

export default function AboutPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Head>
        <title>About Us | Pet Adoption Platform</title>
        <meta
          name="description"
          content="Learn about our mission to connect pets with loving homes through innovative technology and compassionate service."
        />
      </Head>

      <Box component="main">
        {/* Logo Section */}
        <Box
          sx={{
            position: "relative",
            height: "60vh",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src="/slides/slide1.jpg"
            alt="WOOF banner with logo"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.8)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "white",
              zIndex: 1,
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: isMobile ? "2.5rem" : "4rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              Making Tails Wag
            </Typography>
            <Typography variant="h5" sx={{ maxWidth: "800px" }}>
              {missionStatement.content}
            </Typography>
          </Box>
        </Box>

        <Container maxWidth="lg" sx={{ py: 8 }}>
          {/* Mission Section */}
          <Box sx={{ mb: 8, textAlign: "center" }}>
            <Typography variant="h2" sx={{ mb: 4 }}>
              {missionStatement.title}
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: "800px", mx: "auto" }}>
              {missionStatement.content}
            </Typography>
          </Box>

          <Divider sx={{ my: 8 }} />

          {/* Features Section */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h2" align="center" sx={{ mb: 6 }}>
              What Sets Us Apart
            </Typography>
            <Grid
              container
              spacing={4}
              alignItems="center"
              justifyContent="center"
            >
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ my: 8 }} />

          {/* Team Section */}
          <Box>
            <Typography variant="h2" align="center" sx={{ mb: 6 }}>
              Meet Our Dedicated Team
            </Typography>
            <Grid
              container
              spacing={4}
              alignItems="center"
              justifyContent="center"
            >
              {teamMembers.map((person, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <TeamMemberCard
                    member={person.member}
                    role={person.role}
                    description={person.description}
                    imgLink={person.imgLink}
                    github={person.githubLink}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}
