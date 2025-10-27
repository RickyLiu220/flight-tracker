import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Plane, Bell, TrendingDown, Mail } from "lucide-react";
import { handleLogin, handleSignUp, type User } from "../utils/userAuth";

interface LandingPageProps {
  onLogin: (userData: User) => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await handleLogin(loginForm.email, loginForm.password);
      onLogin(user);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const signup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await handleSignUp(
        signupForm.email,
        signupForm.username,
        signupForm.password
      );
      onLogin(user);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Plane className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">
              FlightAlert
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Hero Section */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Never Miss a Flight Deal Again
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get instant email alerts when flight prices drop below your
              budget. Set your departure city and maximum price, and we'll
              monitor flights for you.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-700">Real-time price alerts</span>
              </div>
              <div className="flex items-center">
                <TrendingDown className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-700">Track price drops</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-700">Email notifications</span>
              </div>
            </div>
          </div>

          {/* Authentication Card */}
          <div>
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle>Get Started</CardTitle>
                <CardDescription>
                  Sign up or log in to start tracking flight prices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={login} className="space-y-4">
                      <div>
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          value={loginForm.email}
                          onChange={(e) =>
                            setLoginForm({
                              ...loginForm,
                              email: e.target.value,
                            })
                          }
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          value={loginForm.password}
                          onChange={(e) =>
                            setLoginForm({
                              ...loginForm,
                              password: e.target.value,
                            })
                          }
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Log In
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={signup} className="space-y-4">
                      <div>
                        <Label htmlFor="signup-name">Username</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          value={signupForm.username}
                          onChange={(e) =>
                            setSignupForm({
                              ...signupForm,
                              username: e.target.value,
                            })
                          }
                          placeholder="Enter your username"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          value={signupForm.email}
                          onChange={(e) =>
                            setSignupForm({
                              ...signupForm,
                              email: e.target.value,
                            })
                          }
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          value={signupForm.password}
                          onChange={(e) =>
                            setSignupForm({
                              ...signupForm,
                              password: e.target.value,
                            })
                          }
                          placeholder="Create a password"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Sign Up
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={handleGoogleLogin}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
