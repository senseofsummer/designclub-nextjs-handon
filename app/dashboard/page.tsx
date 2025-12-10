'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Avatar
} from '@mui/material';
import { Dashboard as DashboardIcon, School, Event, Person, ExitToApp } from '@mui/icons-material';
import { RootState } from '../../store/store';
import { getWorkshops } from '../../apis/workshopApi';
import { getCourses } from '../../apis/courseApi';
import { logout } from '../../store/reducers';
import { useDispatch } from 'react-redux';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [workshopsData, coursesData] = await Promise.all([
          getWorkshops({ limit: 3 }),
          getCourses({ limit: 3 })
        ]);
        setWorkshops(workshopsData);
        setCourses(coursesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Design Club Dashboard
          </Typography>
          <Button color="inherit" onClick={() => router.push('/workshops')}>
            Workshops
          </Button>
          <Button color="inherit" onClick={() => router.push('/courses')}>
            Courses
          </Button>
          <Button color="inherit" onClick={() => router.push('/mentorship')}>
            Mentorship
          </Button>
          <Button color="inherit" onClick={() => router.push('/profile')}>
            Profile
          </Button>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.email}!
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Quick Stats */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Event sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{workshops.length}</Typography>
                    <Typography color="textSecondary">Upcoming Workshops</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <School sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{courses.length}</Typography>
                    <Typography color="textSecondary">Available Courses</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Person sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4">0</Typography>
                    <Typography color="textSecondary">Active Mentorships</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Workshops */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Workshops
                </Typography>
                {workshops.length > 0 ? (
                  workshops.map((workshop) => (
                    <Box key={workshop.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {workshop.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {workshop.description.substring(0, 100)}...
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip label={workshop.category} size="small" sx={{ mr: 1 }} />
                        <Chip label={workshop.status || 'upcoming'} size="small" color="primary" />
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ mt: 1 }}
                        onClick={() => router.push(`/workshops/${workshop.id}`)}
                      >
                        View Details
                      </Button>
                    </Box>
                  ))
                ) : (
                  <Typography color="textSecondary">No workshops available</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Courses */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Featured Courses
                </Typography>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <Box key={course.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {course.description.substring(0, 100)}...
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip label={course.level} size="small" sx={{ mr: 1 }} />
                        <Chip label={course.category} size="small" />
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ mt: 1 }}
                        onClick={() => router.push(`/courses/${course.id}`)}
                      >
                        View Course
                      </Button>
                    </Box>
                  ))
                ) : (
                  <Typography color="textSecondary">No courses available</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;

