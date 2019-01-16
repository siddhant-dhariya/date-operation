import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://authentication-20230.firebaseio.com/'
});

export default axiosInstance;