import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api'; // Update this line to point to your backend

const loginUser = async (credentials: { username: string; password: string }) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

const createUser = async (userData: { username: string; password: string; email: string }) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export { loginUser, createUser };
