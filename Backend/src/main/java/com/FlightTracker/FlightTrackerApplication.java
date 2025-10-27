package com.FlightTracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class FlightTrackerApplication {

	public static void main(String[] args) {
		// Load .env before Spring Boot initializes
		Dotenv dotenv = Dotenv.load();

		// Set system properties so Spring can resolve ${DB_URL}, etc.
		System.setProperty("DB_URL", dotenv.get("DB_URL"));
		System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
		System.setProperty("GOOGLE_CLIENT_ID", dotenv.get("GOOGLE_CLIENT_ID"));
		System.setProperty("GOOGLE_SECRET_ID", dotenv.get("GOOGLE_SECRET_ID"));

		// Now start Spring Boot
		SpringApplication.run(FlightTrackerApplication.class, args);
	}
}
