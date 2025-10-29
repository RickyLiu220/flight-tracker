package com.FlightTracker.Services;

import com.FlightTracker.Repos.TrackerRepo;
import com.FlightTracker.Models.FlightTrackRequest;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;

@Service
public class TrackerService {

    private final TrackerRepo tRepo;

    public TrackerService(TrackerRepo repo) {
        this.tRepo = repo;
    }

    // Add a new flight tracking request
    public FlightTrackRequest addRequest(int uid, String userEmail, String origin, String destination,
            double maxPrice) {
        // Optional: check for duplicate before saving
        if (tRepo.existsByUidAndOriginAndDestination(uid, origin, destination)) {
            throw new IllegalArgumentException("Tracker already exists for this user and route.");
        }

        FlightTrackRequest request = new FlightTrackRequest();
        request.setUid(uid);
        request.setUserEmail(userEmail);
        request.setOrigin(origin);
        request.setDestination(destination);
        request.setMaxPrice(maxPrice);

        System.out.println("hi");

        try {
            return tRepo.save(request);
        } catch (DataIntegrityViolationException e) {
            // In case the DB unique constraint still triggers
            throw new IllegalArgumentException("Tracker already exists for this user and route.");
        }
    }

    // Delete a flight tracking request by ID
    public void deleteRequest(Long id) {
        tRepo.deleteById(id);
    }

    // Get all trackers for a user
    public List<FlightTrackRequest> getUserTrackers(int uid) {
        return tRepo.findByUid(uid);
    }

    public FlightTrackRequest updateMaxPrice(Long id, double newMaxPrice) {
        FlightTrackRequest request = tRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tracker not found"));

        request.setMaxPrice(newMaxPrice);
        return tRepo.save(request);
    }

}
