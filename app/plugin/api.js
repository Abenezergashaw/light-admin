import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  // 1. Get the base URL from nuxt.config (or fallback to your VPS IP)
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase || "http://localhost:5000";

  const api = axios.create({
    baseURL,
    withCredentials: true, // MANDATORY: This sends your Redis session cookie
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // 2. Request Interceptor (Optional: Add a loading state or logs)
  api.interceptors.request.use(
    (config) => {
      // You could trigger a global loading bar here
      return config;
    },
    (error) => Promise.reject(error),
  );

  // 3. Response Interceptor (The "Safety Net")
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle the "Unauthorized" (401) error if the session expires
      if (error.response?.status === 401) {
        console.warn("Session expired. Redirecting...");
        // navigateTo('/login') // Nuxt helper to redirect
      }

      // Format the error message for your UI
      const errorMessage =
        error.response?.data?.message || "Server connection failed";
      return Promise.reject(errorMessage);
    },
  );

  // 4. Inject it into the Nuxt app as $api
  return {
    provide: {
      api: api,
    },
  };
});
