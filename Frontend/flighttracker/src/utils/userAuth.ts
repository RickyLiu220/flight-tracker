import axios from "axios";



export interface User {
  id: number;
  username: string;
  email: string;
}

interface APILoginResponse {
  token: string;
  id: number;
  username: string;
  email: string;
}

function mapToUser(response: APILoginResponse): User {
  return {
    id: Number(response.id),
    username: response.username,
    email: response.email,
  };
}



export async function handleLogin(email: string, password: string) {
  try {
    const response = await axios.post<APILoginResponse>("http://localhost:8080/api/login", {
      email,
      password,
    });
    console.log("API response data:", response.data);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("username", response.data.username);
    localStorage.setItem("id", response.data.id.toString());
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
