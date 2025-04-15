import axios from 'axios';
const API_BASE_URL = '/api/medication';

// Fetch medications for a specific user
export const getMedications = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/${userId}`);
    return response.data;
  };