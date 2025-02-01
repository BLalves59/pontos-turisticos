import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5105/api", //Endereço base da API
});

export default api;