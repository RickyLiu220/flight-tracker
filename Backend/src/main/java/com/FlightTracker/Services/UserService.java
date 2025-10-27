package com.FlightTracker.Services;

import com.FlightTracker.Models.LoginResponse;
import com.FlightTracker.Models.UserPrincipal;
import com.FlightTracker.Models.Users;
import com.FlightTracker.Repos.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


@Service
public class UserService {

    private final JWTService jwtService;
    private final AuthenticationManager authManager;
    private final UserRepo userRepo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);



    @Autowired
    public UserService(JWTService jwtService, AuthenticationManager auth, UserRepo userRepo) {
        this.jwtService = jwtService;
        this.authManager = auth;
        this.userRepo = userRepo;
    }


    public Users register(Users user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    public LoginResponse verify(Users user) throws RuntimeException {
        Authentication authentication = authManager
                .authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

        Users person = userRepo.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(person.getId());

        return new LoginResponse(person.getUsername(), token, person.getId(), person.getEmail());
    }

    // Code for /me endpoint in api
    public LoginResponse getCurrentUser(UserPrincipal principal) {
        long userId = principal.getUser().getId();
        Users person = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return new LoginResponse(person.getUsername(), null, person.getId(), person.getEmail());
    }
}