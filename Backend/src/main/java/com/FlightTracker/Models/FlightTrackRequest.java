package com.FlightTracker.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "flight_track_requests", uniqueConstraints = {
                @UniqueConstraint(columnNames = { "uid", "origin", "destination" }) }, indexes = {
                                @Index(name = "idx_uid", columnList = "uid"),
                                @Index(name = "idx_origin_dest", columnList = "origin, destination")
                })

public class FlightTrackRequest {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false)
        private int uid;

        @Column(nullable = false)
        private String userEmail;

        @Column(nullable = false)
        private String origin;

        @Column(nullable = false)
        private String destination;

        @Column(nullable = false)
        private double maxPrice;

}
