// Format date to readable string
export const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    

    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  export const formatDateOnly = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };
  
 
  export const formatTimeOnly = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
 
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  

  export const calculateDuration = (startDateString, endDateString) => {
    if (!startDateString || !endDateString) return '';
    
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    
    const durationMs = endDate - startDate;
    const durationHours = durationMs / (1000 * 60 * 60);
    
    return durationHours.toFixed(1);
  };
  

  export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength) + '...';
  };
  
  
  export const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  

  export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Format: YYYY-MM-DDThh:mm
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };