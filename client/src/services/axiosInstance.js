// services/axiosInstance.js
import axios from "axios";

// Utility to prepare FormData
const prepareFormData = (data, fileFields = []) => {
    const formData = new FormData();
  
    Object.entries(data).forEach(([key, value]) => {
      if (fileFields.includes(key)) {
        if (Array.isArray(value)) {
          value.forEach((file, index) => {
            console.log(`Appending file: ${key}[${index}]["file"]`, file);
            formData.append(`${key}[${index}]["file"]`, file.file); // Append actual file
          });
        }
      } else {
        console.log(`Appending non-file: ${key}`);
        formData.append(key, JSON.stringify(value));
      }
    });
  
    console.log("FormData being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    return formData;
  };

// Axios instance with interceptor
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

apiClient.interceptors.request.use((config) => {
    if (config.data?.useFormData) {
      const { payload, fileFields } = config.data;
      config.data = prepareFormData(payload, fileFields);
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  });

export default apiClient;
