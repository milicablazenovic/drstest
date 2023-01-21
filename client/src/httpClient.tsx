import axios from "axios";

export default axios.create({
  // to send all of the cookies here
  withCredentials: true,
  baseURL: "http://drsapi:5000",
});
