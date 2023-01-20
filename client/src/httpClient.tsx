import axios from "axios";

export default axios.create({
  // to send all of the cookies here
  withCredentials: true,
  baseURL: "http://127.0.0.1:5000",
});
