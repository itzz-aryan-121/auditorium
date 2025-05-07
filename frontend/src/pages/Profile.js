import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Avatar, TextField, Button, Paper, Divider, Snackbar, Alert } from '@mui/material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setProfilePic(user?.profilePic || '');
  }, [user]);

  // Handle profile picture file upload (optional, fallback to URL)
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePic(URL.createObjectURL(file));
    }
  };

  // Save profile (name and profilePic)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let profilePicUrl = profilePic;
      // If file selected, upload to a file server or cloud (for now, just use URL.createObjectURL)
      // In production, you would upload to S3, Cloudinary, etc.
      // For now, we'll just use the preview URL or let user paste a URL
      const res = await api.patch('/auth/me', { name, profilePic: profilePicUrl });
      setUser((prev) => ({ ...prev, name: res.data.name, profilePic: res.data.profilePic }));
      setSnackbar({ open: true, message: 'Profile updated!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to update profile', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch('/auth/me/password', { oldPassword, newPassword });
      setSnackbar({ open: true, message: 'Password updated!', severity: 'success' });
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to update password', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>My Profile</Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Avatar src={profilePic} sx={{ width: 96, height: 96, mb: 1 }} />
          <Button variant="outlined" component="label" sx={{ mb: 1 }}>
            Change Picture
            <input type="file" accept="image/*" hidden onChange={handleProfilePicChange} />
          </Button>
          <TextField
            label="Or paste image URL"
            value={profilePic}
            onChange={e => setProfilePic(e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleSaveProfile} disabled={loading} fullWidth sx={{ mb: 2 }}>
            Save Profile
          </Button>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" fontWeight={600} gutterBottom>Change Password</Typography>
        <Box component="form" onSubmit={handleChangePassword} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Old Password"
            type="password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            fullWidth
            required
            inputProps={{ minLength: 6 }}
          />
          <Button type="submit" variant="contained" color="secondary" disabled={loading} fullWidth>
            Change Password
          </Button>
        </Box>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 