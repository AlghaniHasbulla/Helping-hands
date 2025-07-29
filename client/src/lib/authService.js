import api from './api'; 

/**

 * @param {object} credentials 
 * @param {string} credentials.email 
 * @param {string} credentials.password 
 * @returns {Promise<object>} 
 */
export const apiLogin = async (credentials) => {

  const response = await api.post('/login', credentials);
  return response.data;
};

/**
 * Performs a user registration (sign up) request.
 * @param {object} userData - An object containing the new user's details.
 *                            e.g., { fullName, email, password, role: 'donor' }
 * @returns {Promise<object>} A promise that resolves to the newly created user's data.
 */
export const apiSignUp = async (userData) => {
  // Your backend might have a different registration path, e.g., '/auth/register'. Adjust if needed.
  const response = await api.post('/register', userData); 
  return response.data;
};

/**
 * (Optional) Example for a "forgot password" request.
 * @param {string} email - 
 * @returns {Promise<object>} 
 */
export const apiForgotPassword = async (email) => {
  const response = await api.post('/forgot-password', { email });
  return response.data;
};

/**
 * (Optional) Example for resetting a password with a token.
 * @param {object} resetData 
 * @param {string} resetData.token 
 * @param {string} resetData.newPassword
 * @returns {Promise<object>} 
 */
export const apiResetPassword = async (resetData) => {
  const response = await api.post('/reset-password', resetData);
  return response.data;
};