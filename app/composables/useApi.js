import axios from "axios";

export const useApi = () => {
  let apiInstance = null;

  const call = async ({
    url,
    method = "GET",
    data = null,
    params = null,
    credentials = false,
  }) => {
    // all Nuxt composables called here, inside setup context
    const config = useRuntimeConfig();
    const { url: baseURL } = useUrl();
    const token = useCookie("token");

    if (!apiInstance) {
      apiInstance = axios.create({
        baseURL,
        timeout: 10000,
      });

      apiInstance.interceptors.request.use((req) => {
        if (token.value) {
          req.headers.Authorization = `Bearer ${token.value}`;
        }
        return req;
      });
    }

    try {
      const res = await apiInstance({
        url,
        method,
        data,
        params,
        withCredentials: true,
      });

      return res.data;
    } catch (err) {
      if (err.response) {
        throw err.response.data;
      }
      throw err;
    }
  };

  return { call };
};
