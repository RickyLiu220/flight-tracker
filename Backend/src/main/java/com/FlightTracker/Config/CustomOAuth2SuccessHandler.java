package com.FlightTracker.Config;

import com.FlightTracker.Models.Users;
import com.FlightTracker.Repos.UserRepo;
import com.FlightTracker.Services.JWTService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JWTService jwtService;
    private UserRepo userRepo;



    @Autowired
    public CustomOAuth2SuccessHandler(JWTService jwtService, UserRepo userRepo) {
        this.jwtService = jwtService;
        this.userRepo = userRepo;
    }


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        var principal = authentication.getPrincipal();

        String googleID;
        String email;
        String name;

        if (principal instanceof org.springframework.security.oauth2.core.oidc.user.OidcUser oidc) {
            googleID= oidc.getSubject();                        // OIDC stable ID
            email   = oidc.getEmail();
            name    = (String) oidc.getAttributes().get("name");
        } else {
            var user = (org.springframework.security.oauth2.core.user.OAuth2User) principal;
            googleID= (String) user.getAttribute("sub");
            email   = (String) user.getAttribute("email");
            name    = (String) user.getAttribute("name");
        }

        var userOpt = userRepo.findByGoogleID(googleID);
        Users user = userOpt.orElseGet(Users::new);
        user.setGoogleID(googleID);
        user.setEmail(email);
        user.setUsername(name);

        Users savedUser = userRepo.saveAndFlush(user); // flush guarantees insert now
        Long userId = savedUser.getId();
        System.out.println(savedUser);

        String jwt = jwtService.generateToken(userId);
        // issue short-lived JWT (your app's token) and set HttpOnly cookie
        ResponseCookie cookie = ResponseCookie.from("APP_ACCESS_TOKEN", jwt)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofMinutes(15))
                .sameSite("Lax")
                .build();



        // Use a fragment so the token isn't sent to your server via query/referrer
        response.addHeader("Set-Cookie", cookie.toString());
        response.sendRedirect("http://localhost:5173/oauth/callback");
    }

}
