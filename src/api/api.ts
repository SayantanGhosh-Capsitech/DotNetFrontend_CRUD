import axios from 'axios';

const API = axios.create({
    baseURL:'http://localhost:5200/api'
});
export default API;