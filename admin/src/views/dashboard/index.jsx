import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import Chart from 'react-apexcharts';
import {
  IconCurrencyDollar,
  IconUsers,
  IconToolsKitchen2,
  IconClock,
  IconArrowUpRight,
  IconArrowDownRight,
  IconDotsVertical,
  IconDownload,
  IconRefresh,
  IconEye,
} from '@tabler/icons-react';
import MainCard from '../../ui-component/cards/MainCard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('Month');

  // Bar Chart options (Revenue vs Cost)
  const revenueChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
      fontFamily: theme.typography.fontFamily,
    },
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: { colors: theme.palette.text.secondary },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => `$${val}k`,
        style: { colors: theme.palette.text.secondary },
      },
    },
    fill: { opacity: 1 },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: { formatter: (val) => `$${val},000` },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: { colors: theme.palette.text.primary },
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 4,
    },
  };

  const revenueChartSeries = [
    { name: 'Revenue', data: [35, 41, 62, 42, 53, 68, 79, 85, 92, 88, 95, 110] },
    { name: 'Operating Cost', data: [20, 24, 30, 28, 32, 38, 45, 48, 50, 49, 52, 60] },
  ];

  // Area Chart options (Traffic & Orders)
  const trafficChartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      fontFamily: theme.typography.fontFamily,
    },
    colors: [theme.palette.primary.main],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: { style: { colors: theme.palette.text.secondary } },
    },
    yaxis: {
      labels: { style: { colors: theme.palette.text.secondary } },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 4,
    },
  };

  const trafficChartSeries = [{ name: 'Kitchen Orders', data: [120, 190, 170, 240, 310, 460, 390] }];

  // Donut chart for recipe categories
  const donutChartOptions = {
    chart: { type: 'donut', fontFamily: theme.typography.fontFamily },
    labels: ['Italian', 'Japanese', 'Healthy & Vegan', 'Grill & BBQ', 'Desserts'],
    colors: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    legend: { position: 'bottom', labels: { colors: theme.palette.text.primary } },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Items',
              fontSize: '14px',
              fontWeight: 600,
              color: theme.palette.text.secondary,
              formatter: () => '1,480',
            },
          },
        },
      },
    },
  };

  const donutChartSeries = [450, 380, 290, 210, 150];

  const recentOrders = [
    { id: 'ORD-8921', item: 'Artisan Sourdough Pizza', customer: 'David Beckham', amount: '$37.00', status: 'Delivered', time: '5m ago' },
    { id: 'ORD-8920', item: 'Truffle Mushroom Risotto', customer: 'Emma Watson', amount: '$48.00', status: 'Preparing', time: '12m ago' },
    { id: 'ORD-8919', item: 'Spicy Dragon Ramen', customer: 'Liam Hemsworth', amount: '$32.00', status: 'Delivered', time: '25m ago' },
    { id: 'ORD-8918', item: 'Avocado Goddess Bowl', customer: 'Serena Williams', amount: '$29.00', status: 'Pending', time: '40m ago' },
    { id: 'ORD-8917', item: 'Matcha Lava Soufflé', customer: 'Chris Evans', amount: '$24.00', status: 'Delivered', time: '1h ago' },
  ];

  return (
    <Grid container spacing={3}>
      {/* 4 Stat Metric Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <MainCard sx={{ bgcolor: theme.palette.background.paper, border: '1px solid', borderColor: theme.palette.grey[200] }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 600 }}>
                TOTAL REVENUE
              </Typography>
              <Typography variant="h2" sx={{ my: 1, fontWeight: 800 }}>
                $128,450
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Chip
                  icon={<IconArrowUpRight size="14px" />}
                  label="+18.4%"
                  size="small"
                  color="success"
                  sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                />
                <Typography variant="caption" color="textSecondary">
                  vs last month
                </Typography>
              </Stack>
            </Box>
            <Avatar sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.main, width: 48, height: 48 }}>
              <IconCurrencyDollar size="26px" />
            </Avatar>
          </Stack>
        </MainCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MainCard sx={{ bgcolor: theme.palette.background.paper, border: '1px solid', borderColor: theme.palette.grey[200] }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 600 }}>
                ACTIVE MEMBERS
              </Typography>
              <Typography variant="h2" sx={{ my: 1, fontWeight: 800 }}>
                14,290
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Chip
                  icon={<IconArrowUpRight size="14px" />}
                  label="+12.1%"
                  size="small"
                  color="success"
                  sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                />
                <Typography variant="caption" color="textSecondary">
                  vs last month
                </Typography>
              </Stack>
            </Box>
            <Avatar sx={{ bgcolor: theme.palette.secondary.light, color: theme.palette.secondary.main, width: 48, height: 48 }}>
              <IconUsers size="26px" />
            </Avatar>
          </Stack>
        </MainCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MainCard sx={{ bgcolor: theme.palette.background.paper, border: '1px solid', borderColor: theme.palette.grey[200] }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 600 }}>
                RECIPE ORDERS
              </Typography>
              <Typography variant="h2" sx={{ my: 1, fontWeight: 800 }}>
                3,840
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Chip
                  icon={<IconArrowUpRight size="14px" />}
                  label="+9.8%"
                  size="small"
                  color="success"
                  sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                />
                <Typography variant="caption" color="textSecondary">
                  vs last week
                </Typography>
              </Stack>
            </Box>
            <Avatar sx={{ bgcolor: '#fffbeb', color: '#f59e0b', width: 48, height: 48 }}>
              <IconToolsKitchen2 size="26px" />
            </Avatar>
          </Stack>
        </MainCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MainCard sx={{ bgcolor: theme.palette.background.paper, border: '1px solid', borderColor: theme.palette.grey[200] }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 600 }}>
                AVG PREP TIME
              </Typography>
              <Typography variant="h2" sx={{ my: 1, fontWeight: 800 }}>
                18.5 min
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Chip
                  icon={<IconArrowDownRight size="14px" />}
                  label="-2.4 min"
                  size="small"
                  color="success"
                  sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                />
                <Typography variant="caption" color="textSecondary">
                  efficiency gain
                </Typography>
              </Stack>
            </Box>
            <Avatar sx={{ bgcolor: '#fef2f2', color: '#ef4444', width: 48, height: 48 }}>
              <IconClock size="26px" />
            </Avatar>
          </Stack>
        </MainCard>
      </Grid>

      {/* Main Bar Chart: Revenue Analytics */}
      <Grid item xs={12} lg={8}>
        <MainCard
          title="Revenue & Operating Cost Analytics"
          secondary={
            <Stack direction="row" spacing={1}>
              <Button size="small" variant={timeRange === 'Month' ? 'contained' : 'outlined'} onClick={() => setTimeRange('Month')}>
                Month
              </Button>
              <Button size="small" variant={timeRange === 'Year' ? 'contained' : 'outlined'} onClick={() => setTimeRange('Year')}>
                Year
              </Button>
            </Stack>
          }
        >
          <Chart options={revenueChartOptions} series={revenueChartSeries} type="bar" height={350} />
        </MainCard>
      </Grid>

      {/* Donut Chart: Recipe Share */}
      <Grid item xs={12} lg={4}>
        <MainCard title="Recipe Categories Share">
          <Chart options={donutChartOptions} series={donutChartSeries} type="donut" height={350} />
        </MainCard>
      </Grid>

      {/* Area Chart: Weekly Traffic */}
      <Grid item xs={12} lg={6}>
        <MainCard title="Live Kitchen Weekly Order Volume">
          <Chart options={trafficChartOptions} series={trafficChartSeries} type="area" height={310} />
        </MainCard>
      </Grid>

      {/* Recent Kitchen Activity / Orders Table */}
      <Grid item xs={12} lg={6}>
        <MainCard
          title="Recent Kitchen Orders"
        >
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Dish / Recipe</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{row.id}</TableCell>
                    <TableCell>{row.item}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                      {row.amount}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.status}
                        size="small"
                        color={row.status === 'Delivered' ? 'success' : row.status === 'Preparing' ? 'warning' : 'default'}
                        sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
