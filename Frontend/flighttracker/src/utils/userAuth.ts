import axios from "axios";



export interface User {
  username: string;
  email: string;
}

interface APILoginResponse {
  username: string;
  email: string;
}

function mapToUser(response: APILoginResponse): User {
  return {
    username: response.username,
    email: response.email,
  };
}

export const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // <— send & accept cookies cross-origin
  // validateStatus lets you handle non-2xx as errors in catch:
  validateStatus: (s) => s >= 200 && s < 300,
});


export async function handleLogin(email: string, password: string) {
  try {
    const response = await api.post<APILoginResponse>("/api/login", {
      email,
      password,
    });
    console.log("API response data:", response.data);
    localStorage.setItem("username", response.data.username);
    localStorage.setItem("email", response.data.email);
    

    return mapToUser(response.data);

  } catch (error: any) {
    console.log(error)
    if (error.response) {
      throw new Error(error.response.data.message || "Login failed");
    } else {
      throw new Error("Unable to connect to server");
    }
  }
}

export async function handleSignUp(
  email: string,
  username: string,
  password: string
) {
  try {
    const response = await axios.post("http://localhost:8080/api/register", {
      email,
      username,
      password,
    });
    console.log("API response data:", response.data);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("username", response.data.username);
    localStorage.setItem("id", response.data.id.toString());
    localStorage.setItem("email", response.data.email);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Signup failed");
    } else {
      throw new Error("Unable to connect to server");
    }
  }
}
