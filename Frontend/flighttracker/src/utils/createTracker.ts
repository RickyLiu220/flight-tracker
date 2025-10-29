// /utils/createTracker.ts
import axios from "axios";

interface CreateTrackerRequest {
  uid: number;
  userEmail: string;
  origin: string;
  destination: string;
  maxPrice: number;
}

/**
 * Get JWT token from localStorage
 */
function getToken(): string | null {
  return localStorage.getItem("token");
}

/**
 * Create a new flight tracking request in the backend.
 */
export const createTracker = async (tracker: CreateTrackerRequest) => {
  const token = getToken();
  if (!token) throw new Error("No JWT token found. Please login first.");

  try {
    console.log("hi");
    const response = await axios.post(
      "http://localhost:8080/api/trackers/create",
      {
        uid: tracker.uid,
        userEmail: tracker.userEmail,
        origin: tracker.origin,
        destination: tracker.destination,
        maxPrice: tracker.maxPrice,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Created tracker
  } catch (error: any) {
    console.error(
      "Failed to create tracker:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Delete a flight tracking request by its ID
 */
export const deleteTracker = async (trackerId: string) => {
  const token = getToken();
  if (!token) throw new Error("No JWT token found. Please login first.");

  try {
    const response = await axios.delete(
      `http://localhost:8080/api/trackers/${trackerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Could be success message or deleted object
  } catch (error: any) {
    console.error(
      "Failed to delete tracker:",
      error.response?.data || error.message
    );
    throw error;
  }
};
