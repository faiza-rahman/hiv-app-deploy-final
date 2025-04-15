import axios from 'axios';

const API_BASE_URL = '/api/symptom';

export const getSymptomLogs = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/${userId}`);
    console.log("previous symptoms:", response.data);
    return response.data;
};

export const saveSymptomLog = async (logData) => {
    const response = await axios.post(API_BASE_URL, logData);
    return response.data;
};