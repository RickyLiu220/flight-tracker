package com.FlightTracker.Services;

import com.FlightTracker.Repos.TrackerRepo;
import com.FlightTracker.Models.FlightTrackRequest;
import com.FlightTracker.Models.Users;
import com.FlightTracker.Models.UserPrincipal;

import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@Service
public class TrackerService {

    private final TrackerRepo tRepo;

    public TrackerService(TrackerRepo repo) {
        this.tRepo = repo;
    }

    // Add a new flight tracking request
    public FlightTrackRequest addRequest(String userEmail, String origin, String destination,
            double maxPrice) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal up = (UserPrincipal) authentication.getPrincipal();
        Users user = up.getUser();
        Long userId = user.getId();
        if (tRepo.existsByUidAndOriginAndDestination(userId, origin, destination)) {
            throw new IllegalArgumentException("Tracker already exists for this user and route.");
        }

        FlightTrackRequest request = new FlightTrackRequest();
        request.setUid(userId);
        request.setUserEmail(userEmail);
        request.setOrigin(origin);
        request.setDestination(destination);
        request.setMaxPrice(maxPrice);

        try {
            return tRepo.save(request);
        } catch (DataIntegrityViolationException e) {
            // In case the DB unique constraint still triggers
            throw new IllegalArgumentException("Tracker already exists for this user and route.");
        }
    }

    // Delete a flight tracking request by ID
    public void deleteRequest(Long trackerId) {

        tRepo.deleteById(trackerId);
    }

    // Get all trackers for a user
    public List<FlightTrackRequest> getUserTrackers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal up = (UserPrincipal) authentication.getPrincipal();
        Users user = up.getUser();
        Long userId = user.getId();

        return tRepo.findByUid(userId);
    }

    public FlightTrackRequest updateMaxPrice(long trackerId, double newMaxPrice) {

        FlightTrackRequest request = tRepo.findById(trackerId)
                .orElseThrow(() -> new IllegalArgumentException("Tracker not found"));

        request.setMaxPrice(newMaxPrice);
        return tRepo.save(request);
    }

}
