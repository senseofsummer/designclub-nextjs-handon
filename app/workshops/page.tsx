'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import { Event, CalendarToday, LocationOn, Person } from '@mui/icons-material';
import { getWorkshops, Workshop } from '../../apis/workshopApi';

const WorkshopsPage: React.FC = () => {
  const router = useRouter();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', category: '' });

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const data = await getWorkshops({ ...filters, limit: 20 });
        setWorkshops(data);
      } catch (error) {
        console.error('Failed to fetch workshops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, [filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Workshops
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="upcoming">Upcoming</MenuItem>
            <MenuItem value="ongoing">Ongoing</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Category"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          sx={{ minWidth: 200 }}
        />
      </Box>

      <Grid container spacing={3}>
        {workshops.map((workshop) => (
          <Grid item xs={12} sm={6} md={4} key={workshop.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {workshop.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {workshop.description.substring(0, 150)}...
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2">
                      {new Date(workshop.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">{workshop.location}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2">{workshop.instructorName}</Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label={workshop.category} size="small" />
                  {workshop.status && (
                    <Chip label={workshop.status} size="small" color="primary" />
                  )}
                  {workshop.price !== undefined && (
                    <Chip label={`$${workshop.price}`} size="small" color="secondary" />
                  )}
                </Box>
              </CardContent>
              
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => router.push(`/workshops/${workshop.id}`)}
                >
                  View Details
                </Button>
                <Button
                  size="small"
                  onClick={() => router.push(`/workshops/${workshop.id}/register`)}
                >
                  Register
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {workshops.length === 0 && (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No workshops found
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default WorkshopsPage;

