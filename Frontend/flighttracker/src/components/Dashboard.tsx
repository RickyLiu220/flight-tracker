import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Plane,
  LogOut,
  Plus,
  Trash2,
  Bell,
  MapPin,
  DollarSign,
  ChevronUp,
  ChevronDown,
  Edit,
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import type { User } from "../utils/userAuth";
import {
  createTracker,
  getUserTrackers,
  deleteTracker,
  updateTrackerPrice,
} from "../utils/trackerUtils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

interface FlightAlert {
  id: number;
  origin: string;
  destination: string;
  maxPrice: number;
  createdAt: string;
}

// Mock cities data
const cities = ["Atlanta, GA", "El Paso, TX"];

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [alerts, setAlerts] = useState<FlightAlert[]>([]);
  const [departureCity, setDepartureCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFail, setShowFail] = useState(false);
  const [expandedAlertId, setExpandedAlertId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState<{ [key: string]: string }>({});

  // Load saved alerts from DB
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const userTrackers = await getUserTrackers();
        setAlerts(userTrackers);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      }
    };

    fetchAlerts();
  }, []);

  // Save alerts to localStorage whenever alerts change
  useEffect(() => {
    localStorage.setItem("flightAlerts", JSON.stringify(alerts));
  }, [alerts]);

  const handleAddAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departureCity || !destinationCity || !maxPrice) return;

    const newTracker = {
      uid: Number(localStorage.getItem("id")), // user ID from localStorage
      userEmail: localStorage.getItem("email") || "", // user email from localStorage
      origin: departureCity,
      destination: destinationCity,
      maxPrice: parseFloat(maxPrice),
    };

    try {
      // Call backend
      const savedTracker = await createTracker(newTracker);

      // Add the returned tracker to local state
      setAlerts([...alerts, savedTracker]);

      // Clear form fields
      setDepartureCity("");
      setDestinationCity("");
      setMaxPrice("");

      // Show success message
      setShowSuccess(true);
      setShowFail(false);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      console.error("Failed to add alert:", error);
      setShowFail(true);
    }
  };

  const handleDeleteAlert = async (id: number) => {
    try {
      // Optimistically update UI first
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));

      // Then tell backend to delete it
      await deleteTracker(id);
    } catch (error) {
      console.error("Failed to delete tracker:", error);
      // Optionally re-fetch from backend to sync state if deletion fails
    }
  };

  const handleUpdateAlert = async (id: number) => {
    const newPrice = editPrice[id];
    if (!newPrice || parseFloat(newPrice) <= 0) return;

    try {
      // 1️⃣ Update the backend
      const updated = await updateTrackerPrice(id, parseFloat(newPrice));

      // 2️⃣ Update local state
      const updatedAlerts = alerts.map((alert) =>
        alert.id === id ? { ...alert, maxPrice: updated.maxPrice } : alert
      );
      setAlerts(updatedAlerts);

      // 3️⃣ Update localStorage
      localStorage.setItem("flightAlerts", JSON.stringify(updatedAlerts));

      // 4️⃣ Reset the edit UI
      setExpandedAlertId(null);
      setEditPrice({ ...editPrice, [id]: "" });
    } catch (err) {
      console.error("Failed to update tracker:", err);
    }
  };

  const toggleAlert = (id: number, currentPrice: number) => {
    if (expandedAlertId === id) {
      setExpandedAlertId(null);
    } else {
      setExpandedAlertId(id);
      setEditPrice({ ...editPrice, [id]: currentPrice.toString() });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Plane className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                FlightAlert
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.username}</span>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add New Alert */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Flight Alert
                </CardTitle>
                <CardDescription>
                  Set up a new price alert for flights from your city
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddAlert} className="space-y-4">
                  <div>
                    <Label htmlFor="departure-city">Departure City</Label>
                    <Select
                      value={departureCity}
                      onValueChange={setDepartureCity}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="destination-city">Destination City</Label>
                    <Select
                      value={destinationCity}
                      onValueChange={setDestinationCity}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="maxPrice">Maximum Price ($USD)</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Enter maximum price"
                      min=".01"
                      step=".01"
                      pattern="^\d+(\.\d{1,2})?$"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!destinationCity || !departureCity || !maxPrice}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Create Alert
                  </Button>
                </form>

                {showSuccess && (
                  <Alert className="mt-4 border-green-200 bg-green-50">
                    <Bell className="h-4 w-4" />
                    <AlertDescription className="text-green-800">
                      Flight alert created successfully! You'll receive email
                      notifications when prices drop.
                    </AlertDescription>
                  </Alert>
                )}

                {showFail && (
                  <Alert className="mt-4 border-red-200 bg-red-50">
                    <Bell className="h-4 w-4" />
                    <AlertDescription className="text-red-800">
                      You are already tracking {destinationCity} {" \u2192 "}
                      {departureCity}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Active Alerts */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Your Flight Alerts
                  </span>
                  <Badge variant="secondary">{alerts.length} active</Badge>
                </CardTitle>
                <CardDescription>
                  Manage your active price alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {alerts.length === 0 ? (
                  <div className="text-center py-12">
                    <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No alerts yet
                    </h3>
                    <p className="text-gray-500">
                      Create your first flight alert to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <Collapsible
                        key={alert.id}
                        open={expandedAlertId === alert.id}
                        onOpenChange={() =>
                          toggleAlert(alert.id, alert.maxPrice)
                        }
                      >
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <CollapsibleTrigger asChild>
                            <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                              <div className="flex items-center space-x-4">
                                <div className="bg-blue-100 p-2 rounded-full">
                                  <MapPin className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {alert.origin} &rarr; {alert.destination}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    Alert when price drops below $
                                    {alert.maxPrice}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  <DollarSign className="h-3 w-3 mr-1" />$
                                  {alert.maxPrice}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteAlert(alert.id);
                                  }}
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                {expandedAlertId === alert.id ? (
                                  <ChevronUp className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <div className="px-4 pb-4 pt-4 bg-gray-50 border-t border-gray-200">
                              <div className="flex items-end space-x-2 mb-2">
                                <Edit className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">
                                  Update Maximum Price
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex-1">
                                  <Label
                                    htmlFor={`edit-price-${alert.id}`}
                                    className="text-xs text-gray-600"
                                  >
                                    New Maximum Price ($)
                                  </Label>
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      id={`edit-price-${alert.id}`}
                                      type="number"
                                      value={editPrice[alert.id] || ""}
                                      onChange={(e) =>
                                        setEditPrice({
                                          ...editPrice,
                                          [alert.id]: e.target.value,
                                        })
                                      }
                                      placeholder="Enter new price"
                                      min="1"
                                      step="1"
                                      className="mt-1"
                                    />
                                    <Button
                                      onClick={() =>
                                        handleUpdateAlert(alert.id)
                                      }
                                      disabled={
                                        !editPrice[alert.id] ||
                                        parseFloat(editPrice[alert.id]) <= 0
                                      }
                                      size="sm"
                                      className="mb-0"
                                    >
                                      Update
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Bell className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900 mb-2">
                    How it works
                  </h3>
                  <p className="text-sm text-gray-600">
                    We monitor flight prices from your selected cities 24/7.
                    When a flight drops below your set price threshold, we'll
                    send you an instant email alert so you can book the deal
                    before it's gone.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
