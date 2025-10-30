package com.FlightTracker.Repos;

import com.FlightTracker.Models.FlightTrackRequest;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface TrackerRepo extends JpaRepository<FlightTrackRequest, Long> {
    boolean existsByUidAndOriginAndDestination(Long uid, String origin, String destination);

    List<FlightTrackRequest> findByUid(Long uid);

}
