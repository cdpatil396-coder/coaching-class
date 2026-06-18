const API_URL =
  process.env.REACT_APP_API_URL === "https://swami-backend-jafr.onrender.com"
    ? "https://swami-backend-jarf.onrender.com"
    : process.env.REACT_APP_API_URL || "https://swami-backend-jarf.onrender.com";

export default API_URL;
