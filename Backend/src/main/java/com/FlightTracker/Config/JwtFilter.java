package com.FlightTracker.Config;

import com.FlightTracker.Services.JWTService;
import com.FlightTracker.Services.MyUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();

    @Autowired
    ApplicationContext context;



    private boolean isOpenEndpoint(HttpServletRequest req) {
        String path = req.getRequestURI();
        String method = req.getMethod();
        if ("OPTIONS".equalsIgnoreCase(method)) return true; // preflight
        return PATH_MATCHER.match("/api/login", path)
                || PATH_MATCHER.match("/api/register", path)
                || PATH_MATCHER.match("/login/oauth2/**", path);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        if (isOpenEndpoint(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = null;

        // 1) Prefer Authorization: Bearer <JWT>
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        // 2) Fallback to HttpOnly cookie: APP_ACCESS_TOKEN
        if (token == null) {
            var cookies = request.getCookies();
            if (cookies != null) {
                for (var c : cookies) {
                    if ("APP_ACCESS_TOKEN".equals(c.getName())) {
                        token = c.getValue();
                        break;
                    }
                }
            }
        }

        // 3) If we have a token and no existing auth, validate and authenticate
        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                String userId = jwtService.extractUserId(token); // subject
                if (userId != null && jwtService.validateToken(token)) {
                    UserDetails userDetails = context.getBean(MyUserDetailsService.class)
                            .loadUserById(userId);

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid or expired token");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

}