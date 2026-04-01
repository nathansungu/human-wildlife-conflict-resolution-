import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box} from '@mui/material';
import Sidebar from './Sidebar';
import AppBar from './AppBar';

const drawerWidth = 280;

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar onMenuClick={handleDrawerToggle} />
      <Sidebar open={drawerOpen} onClose={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          inlineSize: { md: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          minWidth: 0, 
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}