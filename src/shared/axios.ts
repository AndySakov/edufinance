import axios from "axios";
import { useAuth } from "./store";

export const useClient = () => {
  const { user } = useAuth();
  if (user) {
    return axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  } else {
    return axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });
  }
};
