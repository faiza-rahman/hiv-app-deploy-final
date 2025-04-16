import axios from 'axios';
import api from './api';

const API_BASE_URL = '/api/mood';

export const logMood = async (moodData) => {
    const response = await api.post(`${API_BASE_URL}/log`, moodData);
    return response.data;
};

export const getWeeklyMood = async (userId) => {
    const response = await api.get(`${API_BASE_URL}/weekly/${userId}`);
    return response.data;
};