import { Box, Typography, Card, CardContent } from '@mui/material';

const pageInfo = {
  Subscribe: { icon: '📧', title: 'Subscribe', desc: 'Subscribe to receive wildlife detection alerts' },
  Detections: { icon: '🦁', title: 'Detections', desc: 'View and manage wildlife detections' },
  Cameras: { icon: '📹', title: 'Cameras', desc: 'Manage camera locations and streams' },
  Users: { icon: '👥', title: 'Users', desc: 'Manage system users and permissions' },
  Reports: { icon: '📊', title: 'Reports', desc: 'Generate daily and monthly reports' },
  Settings: { icon: '⚙️', title: 'Settings', desc: 'Configure system settings and preferences' }
};

export default function Settings() {
  const info = pageInfo['Settings'];
  
  return (
    <Box>
      <Typography variant="h3" gutterBottom fontWeight={800}>
        {info.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {info.desc}
      </Typography>

      <Card>
        <CardContent sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h1" sx={{ mb: 2 }}>{info.icon}</Typography>
          <Typography variant="h4" gutterBottom fontWeight={700}>
            {info.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {info.desc}
          </Typography>
          <Box
            sx={{
              display: 'inline-block',
              px: 3,
              py: 1.5,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'white',
              fontWeight: 600,
            }}
          >
                      </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
