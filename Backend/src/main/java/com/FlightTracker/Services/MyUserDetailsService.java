package com.FlightTracker.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.FlightTracker.Models.Users;
import com.FlightTracker.Repos.UserRepo;
import com.FlightTracker.Models.UserPrincipal;

@Service
public class MyUserDetailsService implements UserDetailsService {

    private final UserRepo userRepo;



    @Autowired
    public MyUserDetailsService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Users user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        return new UserPrincipal(user);
    }



    public UserDetails loadUserById(String id) throws UsernameNotFoundException {
        final int userId;
        try {
            userId = Integer.parseInt(id);
        } catch (NumberFormatException ex) {
            throw new UsernameNotFoundException("Invalid user id");
        }

        Users user = userRepo.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new UserPrincipal(user);
    }
}
