import axios from 'axios';

const normalizeApiBaseUrl = (url) => {
	const fallback = 'http://localhost:8081/api';
	if (!url || !url.trim()) {
		return fallback;
	}

	const trimmed = url.trim().replace(/\/+$/, '');
	return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const API = axios.create({ baseURL: normalizeApiBaseUrl(process.env.REACT_APP_API_BASE_URL) });

export const getProfile = () => API.get('/profiles/me');
export const updateProfile = (data) => API.put('/profiles/me', data);
export const createRequest = (data) => API.post('/requests', data);
export const getNearbyRequests = (params) => API.get('/search/nearby-requests', { params });
export const getRunHistory = (limit = 40) => API.get('/search/run-history', { params: { limit } });
export const getMessages = (userId) => API.get(`/messages/${userId}`);
export const sendMessage = (data) => API.post('/messages', data);
// Add more for other endpoints