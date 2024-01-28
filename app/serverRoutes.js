import axios from "axios";

const config = {
    baseURL: 'http://localhost:8002',
    appName: 'Personal Finance'
}

const axiosInstance = axios.create({
    baseURL: config.baseURL,
    headers: {
      clientOs: config.appName,
    }
  });

  const ServerRoutes = {
    getAllUsers: () => axiosInstance.get(`/allusers`),
    getUserTransaction: (username) => axiosInstance.get(`/user-overview/${username}`),
    addNewTransaction: (details) => axiosInstance.post('/add-new-transaction', details),
  }

  export default ServerRoutes;