import axios from 'axios';
import api from './api';

const API_BASE_URL = '/api/symptom';

export const getSymptomLogs = async (userId) => {
    const response = await api.get(`${API_BASE_URL}/${userId}`);
    console.log("previous symptoms:", response.data);
    return response.data;
};

export const saveSymptomLog = async (logData) => {
    const response = await api.post(API_BASE_URL, logData);
    return response.data;
};