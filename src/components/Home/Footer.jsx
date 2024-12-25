import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Link, Divider, Paper } from '@mui/material';
import { KeyboardArrowUp, Twitter, LinkedIn, GitHub } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#f8f9fa',
  color: theme.palette.mode === 'dark' ? '#fff' : '#1a1a2e',
  position: 'relative',
  overflow: 'hidden',
  
}));

const ScrollButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#2d2d42' : '#ffffff',
  boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#3d3d52' : '#f8f9fa',
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
  },
  transition: 'all 0.3s ease',
  padding: theme.spacing(2),
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#fff' : '#1a1a2e',
  textDecoration: 'none',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '0',
    height: '2px',
    bottom: '-2px',
    left: '0',
    background: 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)',
    transition: 'width 0.3s ease',
  },
  '&:hover::after': {
    width: '100%',
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#2d2d42' : '#ffffff',
  margin: theme.spacing(0, 1),
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#3d3d52' : '#f8f9fa',
    transform: 'scale(1.1)',
  },
  transition: 'all 0.3s ease',
}));

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <StyledFooter component="footer">
      <Container maxWidth="lg">
        <Box >
          <Box display="flex" justifyContent="center" >
            <ScrollButton onClick={scrollToTop} size="large">
              <KeyboardArrowUp />
            </ScrollButton>
          </Box>

          <Grid container >
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Company
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <StyledLink href="/about">About</StyledLink>
                <StyledLink href="/careers">Careers</StyledLink>
                <StyledLink href="/contact">Contact</StyledLink>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
                Legal
              </Typography>
              <Box display="flex" flexDirection="column" gap={2} alignItems="center">
                <StyledLink href="/privacy">Privacy Policy</StyledLink>
                <StyledLink href="/terms">Terms of Service</StyledLink>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom textAlign={{ xs: 'left', sm: 'right' }}>
                Connect With Us
              </Typography>
              <Box display="flex" justifyContent={{ xs: 'flex-start', sm: 'flex-end' }} gap={1}>
                <SocialButton>
                  <Twitter />
                </SocialButton>
                <SocialButton>
                  <LinkedIn />
                </SocialButton>
                <SocialButton>
                  <GitHub />
                </SocialButton>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ opacity: 0.2 }} />

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Your Website. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Container>
    </StyledFooter>
  );
};

export default Footer;