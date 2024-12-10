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
    linkedin: "https://www.linkedin.com/in/logan-rigdon/",
    description:
      "Logan is the Project Manager at WOOF. He is responsible for establishing the overall vision and strategy for the pet adoption agency. Logan works to host meetings, track requirements, and make sure the rest of the team is primed for success. Logan notably brings his experience as the Project Manager of Prime Time Hotels Shop and Stay service.",
  },
  {
    member: "John (August) Rothpletz",
    role: "Design Engineer",
    imgLink: "team/august.jpg",
    githubLink: "https://github.com/Jarpletz",
    linkedin: "https://www.linkedin.com/in/august-rothpletz/",
  },
  {
    member: "Samuel Fries",
    role: "Project Librarian",
    imgLink: "team/sam.jpeg",
    githubLink: "https://github.com/SamuelF2",
    linkedin: "https://www.linkedin.com/in/samuel-fries/",
  },
  {
    member: "Brendon Newton",
    role: "Requirements Engineer",
    imgLink: "team/brendon.jpeg",
    githubLink: "https://github.com/brendonnewt",
    linkedin: "https://www.linkedin.com/in/brendonnewton/",
    description:
      "Brendon is the Requirements Engineer at WOOF. He's responsible for overseeing requirements documentation and testing to ensure the team meets and exceeds their goals. Brendon drafts diagrams and models to discover and outline the necessary requirements for the team to ensure their goals are clear and concise. Brendon brings past experience from G.R.O.U.P. F.I.V.E. as well as present experience from Sea Quail.",
  },
  {
    member: "Icko Iben",
    role: "Assurance Engineer",
    imgLink: "team/icko.jpeg",
    githubLink: "https://github.com/ickoxii",
    linkedin: "https://www.linkedin.com/in/icko-iben/",
  },
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
            src="banner.jpeg"
            alt="WOOF banner with logo"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.8)",
            }}
          />
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
                    linkedin={person.linkedin}
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
