import axios from 'axios';

const API_URL = 'https://lost-found-backend-xwpo.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  const response = await api.post('/register', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post('/login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('user');
};

export const getItems = async (searchQuery = '') => {
  const url = searchQuery ? `/items/search?name=${searchQuery}` : '/items';
  const response = await api.get(url);
  return response.data;
};

export const createItem = async (itemData) => {
  const response = await api.post('/items', itemData);
  return response.data;
};

export const updateItem = async (id, itemData) => {
  const response = await api.put(`/items/${id}`, itemData);
  return response.data;
};

export const deleteItem = async (id) => {
  const response = await api.delete(`/items/${id}`);
  return response.data;
};

export default api;
