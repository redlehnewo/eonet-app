import axios from "axios";

const instance = axios.create({
  baseURL: `https://eonet.sci.gsfc.nasa.gov/api/v2.1/`
});

export default instance;
