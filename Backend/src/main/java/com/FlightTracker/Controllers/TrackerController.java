package com.FlightTracker.Controllers;

import com.FlightTracker.Models.FlightTrackRequest;
import com.FlightTracker.Services.TrackerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trackers")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TrackerController {

    private final TrackerService trackerService;

    public TrackerController(TrackerService trackerService) {
        this.trackerService = trackerService;
    }

    // ----------------- Create a new tracker -----------------
    @PostMapping("/create")
    public ResponseEntity<?> createTracker(@RequestBody FlightTrackRequest request) {
        try {
            FlightTrackRequest created = trackerService.addRequest(
                    request.getUid(),
                    request.getUserEmail(),
                    request.getOrigin(),
                    request.getDestination(),
                    request.getMaxPrice());
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            // Duplicate route for this user
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    // ----------------- Delete a tracker by ID -----------------
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTracker(@PathVariable Long id) {
        trackerService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }

    // ----------------- Get all trackers for a user -----------------
    @GetMapping("/user/{uid}")
    public ResponseEntity<List<FlightTrackRequest>> getUserTrackers(@PathVariable int uid) {
        System.out.println(uid);
        List<FlightTrackRequest> trackers = trackerService.getUserTrackers(uid);
        return ResponseEntity.ok(trackers);
    }

    @PatchMapping("/{id}/maxPrice")
    public ResponseEntity<?> updateMaxPrice(
            @PathVariable Long id,
            @RequestParam double maxPrice) {
        try {
            FlightTrackRequest updated = trackerService.updateMaxPrice(id, maxPrice);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
