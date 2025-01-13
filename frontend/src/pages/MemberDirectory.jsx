import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Chip,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  Language as WebsiteIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from '../config/api';

const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 
  'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 
  'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
  'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 
  'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad',
  'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah',
  'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai',
  'Raipur', 'Kota', 'Chandigarh', 'Guwahati', 'Solapur', 'Hubli-Dharwad',
  'Mysore', 'Tiruchirappalli', 'Bareilly', 'Aligarh', 'Tiruppur', 'Gurugram',
  'Moradabad', 'Jalandhar', 'Bhubaneswar', 'Salem', 'Warangal', 'Bhiwandi',
  'Saharanpur', 'Gorakhpur', 'Guntur', 'Bikaner', 'Amravati', 'Noida',
  'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad', 'Kochi', 'Nellore',
  'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Rourkela', 'Nanded',
  'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain',
  'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli',
  'Erode', 'Panipat', 'Mangalore', 'Belgaum', 'Ambattur', 'Tirunelveli'
];

const MemberDirectory = () => {
  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    sortBy: 'createdAt:desc'
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch users with debounced search
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        city: filters.city,
        search,
        page
      }).toString();

      const response = await axios.get(`${API_URL}/api/users?${queryParams}`);
      setUsers(response.data.users);
      setTotalPages(response.data.pages);
    } catch (err) {
      setError('Failed to load members');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [filters.city, search, page]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchUsers]);

  // Handlers
  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
    setPage(1);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Render user card
  const renderUserCard = (user) => (
    <Grid item xs={12} sm={6} md={4} key={user._id}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box display="flex" alignItems="flex-start" mb={2}>
            <Avatar
              src={user.profilePicture}
              alt={user.username}
              sx={{ 
                width: 60, 
                height: 60, 
                mr: 2,
                bgcolor: 'primary.main'
              }}
            >
              {user.username[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" gutterBottom>
                {user.username}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {user.city || 'No city specified'}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" paragraph>
            {user.bio || 'No bio available'}
          </Typography>

          {user.skills && user.skills.length > 0 && (
            <Box mb={2}>
              {user.skills.slice(0, 3).map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  size="small"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))}
              {user.skills.length > 3 && (
                <Chip
                  label={`+${user.skills.length - 3}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          )}
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => handleUserClick(user)}>
            View Profile
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

  // Render user dialog
  const renderUserDialog = () => (
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
      {selectedUser && (
        <>
          <DialogTitle>
            <Box display="flex" alignItems="center">
              <Avatar
                src={selectedUser.profilePicture}
                alt={selectedUser.username}
                sx={{ width: 64, height: 64, mr: 2 }}
              />
              <Box>
                <Typography variant="h6">{selectedUser.username}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Member since {new Date(selectedUser.joinedAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box mb={3}>
              <Typography variant="subtitle1" gutterBottom>About</Typography>
              <Typography variant="body1">
                {selectedUser.bio || 'No bio available'}
              </Typography>
            </Box>

            {selectedUser.city && (
              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom>Location</Typography>
                <Typography variant="body1" display="flex" alignItems="center">
                  <LocationIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {selectedUser.city}
                  </Typography>
                </Typography>
              </Box>
            )}

            {selectedUser.skills && selectedUser.skills.length > 0 && (
              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom>Skills</Typography>
                <Box>
                  {selectedUser.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {selectedUser.interests && selectedUser.interests.length > 0 && (
              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom>Interests</Typography>
                <Box>
                  {selectedUser.interests.map((interest, index) => (
                    <Chip
                      key={index}
                      label={interest}
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {selectedUser.socialLinks && Object.values(selectedUser.socialLinks).some(link => link) && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>Social Links</Typography>
                <Box>
                  {selectedUser.socialLinks.linkedin && (
                    <IconButton
                      href={selectedUser.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkedInIcon />
                    </IconButton>
                  )}
                  {selectedUser.socialLinks.github && (
                    <IconButton
                      href={selectedUser.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GitHubIcon />
                    </IconButton>
                  )}
                  {selectedUser.socialLinks.twitter && (
                    <IconButton
                      href={selectedUser.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TwitterIcon />
                    </IconButton>
                  )}
                  {selectedUser.socialLinks.website && (
                    <IconButton
                      href={selectedUser.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <WebsiteIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );

  const filteredUsers = users
    .filter(user => {
      const searchTerm = search.toLowerCase().trim();
      return searchTerm === '' || 
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm);
    })
    .sort((a, b) => {
      const [field, order] = filters.sortBy.split(':');
      if (field === 'username') {
        return order === 'asc' 
          ? a.username.localeCompare(b.username)
          : b.username.localeCompare(a.username);
      }
      return order === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    })
    .filter(user => filters.city === '' || user.city === filters.city);

  if (loading && page === 1) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Search and Filters */}
      <Box mb={4}>
        <Grid container spacing={2}>
          {/* Search Bar */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Search members"
              variant="outlined"
              value={search}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Filters */}
          <Grid item xs={12} md={8}>
            <Stack direction="row" spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>City</InputLabel>
                <Select
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  label="City"
                >
                  <MenuItem value="">All Cities</MenuItem>
                  {indianCities.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  label="Sort By"
                >
                  <MenuItem value="username:asc">Name (A-Z)</MenuItem>
                  <MenuItem value="username:desc">Name (Z-A)</MenuItem>
                  <MenuItem value="createdAt:desc">Newest First</MenuItem>
                  <MenuItem value="createdAt:asc">Oldest First</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Member Grid */}
      <Grid container spacing={3}>
        {filteredUsers.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              No members found matching your criteria.
            </Typography>
          </Grid>
        ) : (
          filteredUsers.map(renderUserCard)
        )}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* User Profile Dialog */}
      {renderUserDialog()}
    </Container>
  );
};

export default MemberDirectory;
