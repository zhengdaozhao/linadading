// src/services/AuthService.js
import axios from 'axios';

const API_URL = 'http://localhost:9700/api/auth/';

const register = (mail, password,team,isManager) => {
    return axios.post(API_URL + 'signup', {
        mail,
        password,
        team,
        isManager
    });
};

const login = (mail, password) => {
    return axios.post(API_URL + 'login', {
        mail,
        password
    });
};

const AuthService = {
    register,
    login
};

export default AuthService;