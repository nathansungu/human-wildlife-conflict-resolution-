import { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Chip,
} from '@mui/material';
import {
  Pets as PetsIcon,
  Videocam as VideocamIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TrendingUp, TrendingDown,
} from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import { dashboardService, detectionService } from '../services/api';
import toast from 'react-hot-toast';

const SPECIES_COLORS = [
  '#6366F1', '#10B981', '#EC4899', '#F59E0B',
  '#3B82F6', '#EF4444', '#8B5CF6', '#14B8A6',
];

const StatCard = ({ title, value, change, trend, icon: Icon, color }) => (
  <Card sx={{ position: 'relative', overflow: 'hidden' }}>
    <Box sx={{
      position: 'absolute', top: 0, right: 0, width: 100, height: 100,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
      transform: 'translate(30%, -30%)',
    }} />
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{
          width: 48, height: 48, borderRadius: 2,
          background: `linear-gradient(135deg, ${color}20, ${color}05)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon sx={{ color, fontSize: 24 }} />
        </Box>
        <Chip
          label={`${trend === 'up' ? '+' : ''}${change}%`}
          size="small"
          icon={trend === 'up' ? <TrendingUp /> : <TrendingDown />}
          sx={{ bgcolor: trend === 'up' ? 'success.main' : 'error.main', color: 'white', fontWeight: 600 }}
        />
      </Box>
      <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={0.5}>
        {title}
      </Typography>
      <Typography variant="h3" fontWeight={800} sx={{ fontFamily: 'Syne' }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

// Transforms flat report array into per-day data for the bar chart
// Output: [{ date: 'Mar 28', zebra: 4, baboon: 2, ... }, ...]
function buildBarData(reports) {
  const groupedByDate = reports.reduce((accumulator, report) => {
    const dateLabel = new Date(report.date).toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
    });

    if (!accumulator[dateLabel]) {
      accumulator[dateLabel] = { date: dateLabel };
    }

    accumulator[dateLabel][report.speciesName] = (accumulator[dateLabel][report.speciesName] || 0) + report.count;

    return accumulator;
  }, {});

  return Object.values(groupedByDate).sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Transforms flat report array into species totals for the pie chart
// Output: [{ name: 'zebra', value: 12 }, ...]
function buildPieData(reports) {
  const totals = {};
  for (const r of reports) {
    totals[r.speciesName] = (totals[r.speciesName] || 0) + r.count;
  }
  return Object.entries(totals).map(([name, value]) => ({ name, value }));
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalDetectionsToday: 0,
    activeCameras: 0,
    verifiedDetections: 0,
    pendingReview: 0,
  });
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [species, setSpecies] = useState([]); 

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, reportRes] = await Promise.all([
        dashboardService.getStats(),
        detectionService.getDailyReport(),
      ]);

      setStats(statsRes.data);

      const reports = reportRes.data;
      setBarData(buildBarData(reports));
      setPieData(buildPieData(reports));
      setSpecies([...new Set(reports.map(r => r.speciesName))]);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    }
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom fontWeight={800}>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Monitor wildlife detections and camera activity in real time
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Total Detections Today" value={stats.totalDetectionsToday || 0}
            change={12} trend="up" icon={PetsIcon} color="#6366F1" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Active Cameras" value={stats.activeCameras || 0}
            change={0} trend="up" icon={VideocamIcon} color="#10B981" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Verified Detections" value={stats.verifiedDetections || 0}
            change={8} trend="up" icon={CheckCircleIcon} color="#EC4899" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Pending Review" value={stats.pendingReview || 0}
            change={-5} trend="down" icon={WarningIcon} color="#F59E0B" />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Bar chart  detections per day per species */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight={700}>
                Detections per Day
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ background: '#1e1e2e', border: 'none', borderRadius: 8 }}
                  />
                  <Legend />
                  {species.map((s, i) => (
                    <Bar key={s} dataKey={s} fill={SPECIES_COLORS[i % SPECIES_COLORS.length]} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie chart total count per species */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight={700}>
                Species Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={SPECIES_COLORS[i % SPECIES_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1e1e2e', border: 'none', borderRadius: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}