import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import axios from "axios";

interface User {
  username: string;
  email: string;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);



// --- Load current user from backend using cookie ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/me", {
          method: "GET",
          credentials: "include", // <-- key part: send HttpOnly cookie
        });

        if (response.ok) {
          const data: User = await response.json();
          setUser(data);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      console.log("User updated:", user);
    } else {
      console.log("User cleared (logged out)");
    }
  }, [user]);



  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/logout", {}, { withCredentials: true });
      console.log(response.data)
    } catch (error: any) {
      console.log(error)
    }

    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("flightAlerts");
  };


  
  if (isAuthenticated && user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return <LandingPage onLogin={handleLogin} />;
}
