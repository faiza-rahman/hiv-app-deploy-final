import axios from 'axios';
import api from './api';
const API_BASE_URL = '/api/medication';

// Fetch medications for a specific user
export const getMedications = async (userId) => {
    const response = await api.get(`${API_BASE_URL}/${userId}`);
    return response.data;
  };