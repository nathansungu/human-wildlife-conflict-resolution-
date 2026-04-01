import { NavLink } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Videocam as VideocamIcon,
  Pets as PetsIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../store';

const drawerWidth = 280;

const navigation = [
  { name: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { name: 'Detections', path: '/detections', icon: PetsIcon },
  { name: 'Cameras', path: '/cameras', icon: VideocamIcon },
  { name: 'Users', path: '/users', icon: PeopleIcon },
  { name: 'Reports', path: '/reports', icon: AssessmentIcon },
  // { name: 'Settings', path: '/settings', icon: SettingsIcon },
];

export default function Sidebar({ open, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuthStore();

  const drawer = (
    <Box sx={{ blockSize: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ p: 3, borderBlockEnd: '1px solid', borderColor: 'divider' }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #6366F1, #EC4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 0.5,
            mt: 1.9
          }}
        >
          HWCR System
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
          Wildlife Recognition
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, p: 2 }}>
        {navigation.map((item) => (
          <ListItem key={item.name} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 0,
                  height: '100%',
                  background: 'linear-gradient(90deg, #6366F1, #EC4899)',
                  opacity: 0.1,
                  transition: 'width 0.3s',
                },
                '&:hover::before, &.active::before': {
                  width: '100%',
                },
                '&.active': {
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  color: 'text.primary',
                },
                color: 'text.secondary',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* User Profile */}
      <Box sx={{ p: 3, borderBlockStart: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #6366F1, #EC4899)',
              fontWeight: 700,
              fontSize: '1.25rem',
            }}
          >
            {user?.name?.charAt(0)}
          </Avatar>
          <Box sx={{ minWidth: "0", flex: 1 }}>
            <Typography variant="subtitle2" noWrap fontWeight={600}>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.roleName}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
}
