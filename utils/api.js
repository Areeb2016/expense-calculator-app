import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.0.105:6969/api/";

const getHeaders = async () => {
  const user = await AsyncStorage.getItem("userData");
  const token = JSON.parse(user).token;
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }
  return {};
};

const useHeaders = () => {
  return {
    headers: getHeaders(),
  };
};

const api = {
  login: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}auth/login`, {
        method: "POST",
        headers: {
          ...useHeaders().headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        return { message: `Login Error: ${error.message}`, success: false };
      }
      const responseData = await response.json();
      return { data: responseData, success: true };
    } catch (error) {
      console.error(error.message);
      return error;
    }
  },

  register: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}auth/register`, {
        method: "POST",
        headers: {
          ...useHeaders().headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          message: `Registeration Error: ${error.error}`,
          success: false,
        };
      }
      const responseData = await response.json();
      return { data: responseData, success: true };
    } catch (error) {
      console.error(error.message);
      return { message: `Server Error: ${error.message}`, success: false };
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await fetch(`${BASE_URL}auth/forgot-password`, {
        method: "POST",
        headers: {
          ...useHeaders().headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Forgot Password Error: ${error.message}`);
      }

      return await response.json();
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}expenses`, {
        method: "POST",
        headers: {
          ...useHeaders().headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Create Error: ${error.message}`);
      }

      return await response.json();
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  read: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}expenses/${id}`, {
        method: "GET",
        headers: {
          ...useHeaders().headers,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Read Error: ${error.message}`);
      }

      return await response.json();
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await fetch(`${BASE_URL}expenses/${id}`, {
        method: "PUT",
        headers: {
          ...useHeaders().headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Update Error: ${error.message}`);
      }

      return await response.json();
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  delete: async (id, data) => {
    try {
      const response = await fetch(`${BASE_URL}expenses/${id}`, {
        method: "DELETE",
        headers: {
          ...useHeaders().headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Delete Error: ${error.message}`);
      }

      return await response.json();
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
};

export default api;
