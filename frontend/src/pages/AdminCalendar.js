import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, CircularProgress } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';

const AdminCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/bookings');
        const formattedEvents = response.data.map(booking => ({
          id: booking._id,
          title: `${booking.title} - ${booking.user.name}`,
          start: booking.startTime,
          end: booking.endTime,
          extendedProps: {
            status: booking.status,
            description: booking.description
          },
          backgroundColor: booking.status === 'approved' ? '#4caf50' : 
                         booking.status === 'pending' ? '#ff9800' : '#f44336'
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        addNotification({ message: 'Failed to fetch bookings for calendar.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [addNotification]);

  const handleEventDrop = async (info) => {
    try {
      const { event } = info;
      await axios.patch(`/api/bookings/${event.id}`, {
        startTime: event.start,
        endTime: event.end
      });
      addNotification({ message: `Booking rescheduled!`, severity: 'success' });
    } catch (error) {
      console.error('Error updating booking:', error);
      info.revert();
      addNotification({ message: 'Failed to reschedule booking.', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Booking Calendar
        </Typography>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          eventDrop={handleEventDrop}
          height="auto"
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
        />
      </Paper>
    </Container>
  );
};

export default AdminCalendar; 