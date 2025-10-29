// /utils/createTracker.ts
import axios from "axios";

export interface CreateTrackerRequest {
  uid: number;
  userEmail: string;
  origin: string;
  destination: string;
  maxPrice: number;
}

/**
 * Create a new flight tracking request in the backend.
 * Relies on JWT stored in an HttpOnly cookie.
 */
export const createTracker = async (tracker: CreateTrackerRequest) => {
  try {
    console.log("Creating tracker...");
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
        withCredentials: true, // <-- send cookies automatically
        headers: {
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
 * Relies on JWT stored in an HttpOnly cookie.
 */
export const deleteTracker = async (trackerId: string) => {
  try {
    const response = await axios.delete(
      `http://localhost:8080/api/trackers/${trackerId}`,
      {
        withCredentials: true, // <-- send cookies automatically
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

/**
 * Fetch all trackers for a specific user
 */
export const getUserTrackers = async () => {
  const uid = localStorage.getItem("id");
  try {
    const response = await axios.get(
      `http://localhost:8080/api/trackers/user/${uid}`,
      { withCredentials: true }
    );
    console.log(response.data)
    return response.data; // list of trackers
  } catch (error: any) {
    console.error("Failed to fetch user trackers:", error.response?.data || error.message);
    throw error;
  }
};