import api from '@/constants/api';
import axios from 'axios';

export const signup = (data) => api.post('/auth/signup', data);
export const loginInfluencer = (data) => api.post('/auth/influencer/login', data);
export const loginBrand = (data) => api.post('/auth/brand/login', data);
export const getConversations = () => api.get('/conversations');
export const getMessages = (conversationId) => api.get(`/messages/${conversationId}`);
export const sendMessage = (data) => api.post('/messages', data);
export const getOrCreateConversation = (otherUserId) => api.post('/conversations', { otherUserId });
export const getCurrentUser = () => api.get('/me');
export const searchUsers = (query) => api.get(`/users/search?query=${query}`);

export default api;