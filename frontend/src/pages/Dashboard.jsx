import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Stack,
  Avatar
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  Event as EventIcon,
  Announcement as AnnouncementIcon,
  Article as ArticleIcon,
  Group as GroupIcon,
  Timeline as TimelineIcon,
  LocationOn as LocationOnIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { API_URL } from '../config/api';

const Dashboard = () => {
  const { user, isNewRegistration, recentJoins } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    onlineMembers: 0,
    totalUpdates: 0,
    recentActivity: 0
  });
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, updatesRes] = await Promise.all([
          axios.get(`${API_URL}/api/community/stats`),
          axios.get(`${API_URL}/api/community/updates`)
        ]);
        setStats(statsRes.data);
        setUpdates(updatesRes.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleLike = async (updateId) => {
    try {
      const response = await axios.post(`${API_URL}/api/community/updates/${updateId}/like`);
      setUpdates(updates.map(update => 
        update._id === updateId ? response.data : update
      ));
    } catch (err) {
      console.error('Error liking update:', err);
    }
  };

  const getUpdateIcon = (type) => {
    switch (type) {
      case 'event':
        return <EventIcon />;
      case 'announcement':
        return <AnnouncementIcon />;
      case 'news':
        return <ArticleIcon />;
      default:
        return <ArticleIcon />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={user.profilePicture}
              alt={user.username}
              sx={{ width: 100, height: 100, mr: 3 }}
            />
            <Box>
              <Typography variant="h4" gutterBottom>
                {isNewRegistration ? `Welcome, ${user.username}!` : `Welcome back, ${user.username}!`}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1 }} />
                <Typography variant="body1">
                  {user.city}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1" sx={{ mt: 2 }}>
            This is your personal dashboard. You can view and manage your profile, 
            connect with other members, and access exclusive community features.
          </Typography>
        </Box>
        <Divider sx={{ my: 3 }} />
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <GroupIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="text.secondary">
                  Total Members
                </Typography>
              </Box>
              <Typography variant="h4">
                {stats.totalMembers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <GroupIcon color="success" sx={{ mr: 1 }} />
                <Typography color="text.secondary">
                  Online Members
                </Typography>
              </Box>
              <Typography variant="h4">
                {stats.onlineMembers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <ArticleIcon color="info" sx={{ mr: 1 }} />
                <Typography color="text.secondary">
                  Total Updates
                </Typography>
              </Box>
              <Typography variant="h4">
                {stats.totalUpdates}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TimelineIcon color="warning" sx={{ mr: 1 }} />
                <Typography color="text.secondary">
                  Recent Activity
                </Typography>
              </Box>
              <Typography variant="h4">
                {stats.recentActivity}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Community Updates */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <NotificationsIcon sx={{ mr: 1 }} /> Recent Updates
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ mt: 2 }}>
          {(updates.length > 0 || recentJoins.length > 0) ? (
            <Grid container spacing={3}>
              {updates.map((update) => (
                <Grid item xs={12} key={update._id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        {getUpdateIcon(update.type)}
                        <Box ml={2}>
                          <Typography variant="h6">{update.title}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Posted by {update.author.username} • {new Date(update.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Chip
                          label={update.type}
                          color={update.type === 'announcement' ? 'error' : update.type === 'event' ? 'primary' : 'default'}
                          size="small"
                          sx={{ ml: 'auto' }}
                        />
                      </Box>
                      <Typography variant="body1" paragraph>
                        {update.content}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<ThumbUpIcon />}
                        onClick={() => handleLike(update._id)}
                      >
                        {update.likes?.length || 0} Likes
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
              
              {/* New Member Notifications */}
              {recentJoins.map((join) => (
                <Grid item xs={12} key={join._id || join.username}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <Box>
                          <Typography variant="h6">New Member Joined</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                mr: 1,
                                bgcolor: 'primary.main',
                                width: 24,
                                height: 24,
                                fontSize: '0.875rem'
                              }}
                            >
                              {join.username[0].toUpperCase()}
                            </Avatar>
                            <Typography variant="body1">
                              {join.username}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                              • Joined {formatDistanceToNow(new Date(join.joinedAt), { addSuffix: true })}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">
                No recent activity. Check back later!
              </Typography>
            </Paper>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Dashboard;
