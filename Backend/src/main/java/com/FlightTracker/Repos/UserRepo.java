package com.FlightTracker.Repos;

import com.FlightTracker.Models.Users;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<Users, Integer> {

    Optional<Users> findByEmail(String email);
    Optional<Users> findByGoogleID(String googleId);
    Optional<Users> findById(long userId);
}
