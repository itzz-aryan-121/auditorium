import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNotifications } from '../context/NotificationContext';

const NotificationToast = () => {
  const { toast, closeToast } = useNotifications();

  return (
    <Snackbar
      open={!!toast}
      autoHideDuration={4000}
      onClose={closeToast}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {toast && (
        <Alert onClose={closeToast} severity={toast.severity || 'info'} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      )}
    </Snackbar>
  );
};

export default NotificationToast; 