import api from './api';

export const getCategories = async () => {
  const response = await api.get('/admin/categories');
  return response.data;
};
export const createCategory = async (categoryData) => {
  const response = await api.post('/admin/categories', categoryData);
  return response.data;
};
export const updateCategory = async (id, updateData) => {
  const response = await api.patch(`/admin/categories/${id}`, updateData);
  return response.data;
};
export const deleteCategory = async (id) => {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
};



export const getPendingRequests = async () => {
    const response = await api.get('/admin/requests/pending');
    return response.data;
};
export const approveRequest = async (id) => {
    const response = await api.patch(`/admin/requests/${id}/approve`, { is_approved: true });
    return response.data;
};
export const rejectRequest = async (id) => {
    const response = await api.patch(`/admin/requests/${id}/approve`, { is_approved: false });
    return response.data;
};



export const getAllUsers = async () => {
    const response = await api.get('/superadmin/users');
    return response.data;
};
export const createUser = async (userData) => {
    const response = await api.post('/superadmin/users', userData);
    return response.data;
};
export const updateUser = async (id, updateData) => {
    const response = await api.patch(`/superadmin/users/${id}`, updateData);
    return response.data;
};
export const deleteUser = async (id) => {
    const response = await api.delete(`/superadmin/users/${id}`);
    return response.data;
};



export const getActionLogs = async () => {
    const response = await api.get('/superadmin/logs');
    return response.data;
};