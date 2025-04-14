
import Axios  from "axios";

const axios = Axios.create({
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });

  export default axios;