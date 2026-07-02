import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

const client = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

const toApiError = (error) => {
  if (error.response?.data) {
    return {
      message: error.response.data.message || "Something went wrong",
      errors: error.response.data.errors || {},
    };
  }
  return { message: error.message || "Network error", errors: {} };
};

export const fetchTasks = async (params = {}) => {
  try {
    const { data } = await client.get("/tasks", { params });
    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
};

export const createTask = async (payload) => {
  try {
    const { data } = await client.post("/tasks", payload);
    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
};

export const updateTask = async (id, payload) => {
  try {
    const { data } = await client.put(`/tasks/${id}`, payload);
    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
};

export const deleteTask = async (id) => {
  try {
    const { data } = await client.delete(`/tasks/${id}`);
    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
};
