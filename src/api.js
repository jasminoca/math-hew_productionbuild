import axios from 'axios';
import { signInSuccess } from './redux/user/userSlice';
import store from './redux/store';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Auth
export const signInUser = async (payload) => {
  const response = await axios.post(`${API_URL}/auth/login`, payload);
  store.dispatch(signInSuccess(response.data.user));
  return response.data;
};

// export const signInUser  = async (identifier, password) => {
//   const response = await axios.post(`${API_URL}/auth/login`, {
//     email: identifier.includes('@') ? identifier : undefined,
//     school_id: identifier.includes('@') ? identifier : undefined,
//     password,
//   });

//   store.dispatch(signInSuccess(response.data.user));
//   return response.data;
// };

// User
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users`, userData); // 🔁 No /register route in Firebase backend
  return response.data;
};

export const updateUser = async (id, updateData) => {
  const response = await axios.patch(`${API_URL}/users/${id}`, updateData);
  return response.data;
};

// Lesson
export const getAllLessons = async () => {
  const response = await axios.get(`${API_URL}/lessons`);
  return response.data;
};

export const getLessonById = async (id) => {
  const response = await axios.get(`${API_URL}/lessons/${id}`);
  return response.data;
};

export const createLesson = async (data) => {
  const response = await axios.post(`${API_URL}/lessons`, data);
  return response.data;
};

export const updateLesson = async (id, data) => {
  const response = await axios.patch(`${API_URL}/lessons/${id}`, data);
  return response.data;
};

//Score
export const submitScore = async (data) => {
  const response = await axios.post(`${API_URL}/scores`, data);
  return response.data;
};

export const getScoresByUser = async (userId) => {
  const response = await axios.get(`${API_URL}/scores/user/${userId}`);
  return response.data;
};

// Video
export const getAllVideos = async () => {
  const response = await axios.get(`${API_URL}/videos`);
  return response.data;
};

export const createVideo = async (data) => {
  const response = await axios.post(`${API_URL}/videos`, data);
  return response.data;
};

export const getUser = async (id) => {
  const response = await axios.get(`${API_URL}/users/${id}`);
  return response.data;
};

export const addKeypoint = async (lessonId, content) => {
  const res = await fetch(`${API_URL}/lessons/${lessonId}/keypoints`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  return await res.json();
};

export const deleteKeypoint = async (lessonId, kpId) => {
  await fetch(`${API_URL}/lessons/${lessonId}/keypoints/${kpId}`, {
    method: "DELETE",
  });
};

export const addQuestion = async (lessonId, data) => {
  const res = await fetch(`${API_URL}/lessons/${lessonId}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const deleteQuestion = async (lessonId, qId) => {
  await fetch(`${API_URL}/lessons/${lessonId}/questions/${qId}`, {
    method: "DELETE",
  });
};

