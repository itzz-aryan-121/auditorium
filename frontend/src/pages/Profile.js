import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Avatar, TextField, Button, Paper, Divider, Snackbar, Alert, CircularProgress } from '@mui/material';
import { auth, upload } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotifications();
  const [name, setName] = useState(user?.name || '');
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setProfilePic(user?.profilePic || '');
  }, [user]);

  // Handle profile picture file upload
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(file);
      setProfilePic(previewUrl);
      
      // Upload to Cloudinary
      setUploading(true);
      try {
        const response = await upload.profilePic(file);
        setProfilePic(response.url);
        addNotification({ message: 'Profile picture uploaded successfully!', severity: 'success' });
      } catch (err) {
        console.error('Upload error:', err);
        addNotification({ 
          message: err.response?.data?.message || 'Failed to upload profile picture. Please try again.', 
          severity: 'error' 
        });
        // Revert to previous profile picture
        setProfilePic(user?.profilePic || '');
      } finally {
        setUploading(false);
        setProfilePicFile(null);
      }
    }
  };

  // Save profile (name and profilePic)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await auth.updateProfile({ name, profilePic });
      const updatedUser = response.data;
      
      // Update the user context with the new data
      updateUser(updatedUser);
      
      addNotification({ message: 'Profile updated successfully!', severity: 'success' });
    } catch (err) {
      console.error('Profile update error:', err);
      addNotification({ 
        message: err.response?.data?.message || 'Failed to update profile. Please try again.', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      addNotification({ 
        message: 'New password must be at least 6 characters long', 
        severity: 'error' 
      });
      return;
    }
    
    setLoading(true);
    try {
      await auth.updatePassword({ oldPassword, newPassword });
      addNotification({ message: 'Password updated successfully!', severity: 'success' });
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      console.error('Password update error:', err);
      addNotification({ 
        message: err.response?.data?.message || 'Failed to update password. Please try again.', 
        severity: 'error' 
      });
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
          <Avatar 
            src={profilePic} 
            sx={{ 
              width: 96, 
              height: 96, 
              mb: 1,
              border: '2px solid',
              borderColor: 'primary.main'
            }} 
          />
          <Button 
            variant="outlined" 
            component="label" 
            sx={{ mb: 1 }}
            disabled={loading || uploading}
          >
            {uploading ? <CircularProgress size={24} /> : 'Change Picture'}
            <input 
              type="file" 
              accept="image/*" 
              hidden 
              onChange={handleProfilePicChange}
              disabled={loading || uploading}
            />
          </Button>
          <TextField
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            disabled={loading || uploading}
          />
          <Button 
            variant="contained" 
            onClick={handleSaveProfile} 
            disabled={loading || uploading} 
            fullWidth 
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Profile'}
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
            disabled={loading || uploading}
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            fullWidth
            required
            inputProps={{ minLength: 6 }}
            disabled={loading || uploading}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="secondary" 
            disabled={loading || uploading} 
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Change Password'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 