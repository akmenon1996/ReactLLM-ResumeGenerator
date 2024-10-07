import axios from 'axios';

const loginUser = async (credentials: { username: string; password: string }) => {
  const response = await axios.post('/api/login', credentials);
  return response.data;
};

const createUser = async (userData: { username: string; password: string; email: string }) => {
  const response = await axios.post('/api/register', userData);
  return response.data;
};

export { loginUser, createUser };
