import axios from 'axios';
import jwt_decode from 'jwt-decode';

const setToken = (token) => {
  localStorage.setItem('token', token);
  axios.defaults.headers.common['authorization'] = token;
};

const removeToken = () => {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['authorization'];
};

const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }
  const decoded = jwt_decode(token);
  if (Date.now() >= decoded.exp * 1000) {
    return false;
  } else {
    return true;
  }
};

export { setToken, removeToken, isLoggedIn };
