import axios from 'axios';

const API_BASE_URL = '/api/mood';

export const logMood = async (moodData) => {
    const response = await axios.post(`${API_BASE_URL}/log`, moodData);
    return response.data;
};

export const getWeeklyMood = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/weekly/${userId}`);
    return response.data;
};