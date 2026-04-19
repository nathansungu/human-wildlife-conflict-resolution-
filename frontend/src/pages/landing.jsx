import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  Link,
} from '@mui/material';
import {
  CameraAlt,
  NotificationsActive,
  Pets,
  Security,
  ArrowForward,
  TravelExplore,
  SmartToy,
  WarningAmber,
} from '@mui/icons-material';

const features = [
  {
    icon: <CameraAlt fontSize="large" />,
    title: 'Multi-Camera Monitoring',
    description:
      'Register and manage multiple live camera streams for continuous wildlife observation.',
  },
  {
    icon: <SmartToy fontSize="large" />,
    title: 'AI Wildlife Detection',
    description:
      'Uses YOLO-based detection to identify species such as elephants, lions, hyenas, zebras, and buffaloes.',
  },
  {
    icon: <NotificationsActive fontSize="large" />,
    title: 'Instant Alerts',
    description:
      'Sends timely SMS and email notifications when high-risk animals are detected near settlements.',
  },
  {
    icon: <TravelExplore fontSize="large" />,
    title: 'Threat Awareness',
    description:
      'Helps communities and administrators respond early through clear, data-driven monitoring.',
  },
];

const stats = [
  { label: 'Supported Species', value: '7+' },
  { label: 'Alert Channels', value: 'SMS & Email' },
  { label: 'System Access', value: 'Web Based' },
];

export default function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              <Chip
                icon={<WarningAmber />}
                label="AI-Powered Human-Wildlife Conflict Resolution"
                sx={{ width: 'fit-content', fontWeight: 600 }}
                color="warning"
                variant="outlined"
              />

              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #6366F1, #EC4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                  }}
                >
                  HWCR System
                </Typography>

                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 2 }}
                >
                  Detect wildlife early. Alert communities faster.
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ maxWidth: 620, lineHeight: 1.8 }}
                >
                  The Human-Wildlife Conflict Resolution System helps monitor
                  wildlife activity near human settlements using AI-powered
                  camera detection. It identifies risk-prone animals in real
                  time, stores detection records, and sends alerts to support
                  faster response and safer communities.
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                >
                  Get Started
                </Button>

                <Button
                  component={RouterLink}
                  to="/subscribe"
                  variant="outlined"
                  size="large"
                >
                  Subscribe for Alerts
                </Button>
              </Stack>

              <Stack direction="row" spacing={2} flexWrap="wrap">
                {stats.map((item) => (
                  <Paper
                    key={item.label}
                    elevation={0}
                    sx={{
                      px: 2.5,
                      py: 1.5,
                      minWidth: 130,
                    }}
                  >
                    <Typography variant="h6" fontWeight={800}>
                      {item.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Why this system matters
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Designed for conservation areas and nearby communities where
                early detection can reduce crop loss, livestock predation, and
                dangerous encounters.
              </Typography>

              <Grid container spacing={2}>
                {features.map((feature) => (
                  <Grid item xs={12} sm={6} key={feature.title}>
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        transition: 'all 0.3s',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-4px)',
                        },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ mb: 1.5, color: 'primary.main' }}>
                          {feature.icon}
                        </Box>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Paper
          elevation={0}
          sx={{
            mt: 6,
            p: 3,
            textAlign: 'center',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box textAlign={{ xs: 'center', md: 'left' }}>
              <Typography variant="h5" fontWeight={700}>
                Ready to monitor wildlife activity more effectively?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Access the dashboard, manage cameras, and receive intelligent alerts.
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                startIcon={<Security />}
              >
                Create Account
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                startIcon={<Pets />}
              >
                Sign In
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 3 }}
        >
          © 2026 HWCR System. Protecting communities and supporting conservation.
        </Typography>
      </Container>
    </Box>
  );
}