import axios from "axios";

axios.defaults.baseURL = "https://roomiesapi-637170cefd22.herokuapp.com/";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();
