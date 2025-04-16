import axios from 'axios';
import api from './api';

const API_BASE_URL = '/api/user';

export const loginUser = async (email, password) => {
    const response = await api.post(`${API_BASE_URL}/login`, { email, password });
    return response.data;
}

export const signupUser = async (name, email, password) => {
    const response = await api.post(`${API_BASE_URL}/signup`, { name, email, password });
    return response.data;
};