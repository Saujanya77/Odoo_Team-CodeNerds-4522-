// utils/api.js


const BASE_URL = 'https://skillswap-backend-mt2t.onrender.com';

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: error.message };
  }
};

export const sendLoginOTP = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/api/user/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return response.json();
  } catch (error) {
    console.error('Send OTP error:', error);
    return { success: false, message: error.message };
  }
};

export const verifyLoginOTP = async (email, otp) => {
  try {
    const response = await fetch(`${BASE_URL}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    return response.json();
  } catch (error) {
    console.error('Verify OTP error:', error);
    return { success: false, message: error.message };
  }
};