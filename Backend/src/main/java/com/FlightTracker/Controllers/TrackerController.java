package com.FlightTracker.Controllers;

import com.FlightTracker.Models.FlightTrackRequest;
import com.FlightTracker.Services.TrackerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trackers")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true", allowedHeaders = {
        "Authorization",
        "Content-Type",
        "X-Requested-With"
}, methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.PUT,
        RequestMethod.DELETE,
        RequestMethod.OPTIONS,
        RequestMethod.PATCH
})
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
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTracker(@PathVariable Long id) {
        trackerService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }

    // ----------------- Get all trackers for a user -----------------
    @GetMapping("/get")
    public ResponseEntity<List<FlightTrackRequest>> getUserTrackers() {
        List<FlightTrackRequest> trackers = trackerService.getUserTrackers();
        return ResponseEntity.ok(trackers);
    }

    @PutMapping("/maxPrice/{id}")
    public ResponseEntity<?> updateMaxPrice(
            @PathVariable Long id,
            @RequestBody Map<String, Double> body) {

        // Extract maxPrice from request body
        Double maxPrice = body.get("maxPrice");
        System.out.println(maxPrice);
        if (maxPrice == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Missing maxPrice in request body");
        }

        System.out.println("Tracker ID: " + id);
        System.out.println("New maxPrice: " + maxPrice);

        try {
            FlightTrackRequest updated = trackerService.updateMaxPrice(id, maxPrice);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
