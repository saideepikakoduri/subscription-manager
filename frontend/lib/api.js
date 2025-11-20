import axios from "axios";

const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_BACKEND_URL });

export const getAuthUrl = () => API.get("/auth/url").then(res => res.data.url);
export const runScan = (tokens) => API.post("/scan", tokens).then(res => res.data);
export const addManualSubscription = (data) => API.post("/manual", data).then(res => res.data);
export const getSubscriptions = () => API.get("/subs").then(res => res.data);
