package com.vsa.controller;

import com.vsa.model.dto.LoginRequest;
import com.vsa.model.dto.RegisterRequest;
import com.vsa.model.response.ApiResponse;
import com.vsa.model.response.AuthResponse;
import com.vsa.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication controller for registering and logging in users.
 * Uses JWT tokens and integrates with Spring Security (JwtFilter + SecurityConfig).
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Register a new user.
     * @param req RegisterRequest containing username, email, password
     * @return ApiResponse with success message
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest req) {
        try {
            authService.register(req);
            return ResponseEntity.ok(new ApiResponse(true, "Registration successful"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, ex.getMessage()));
        }
    }

    /**
     * Login user and return JWT token.
     * @param req LoginRequest with username and password
     * @return AuthResponse containing JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try {
            AuthResponse resp = authService.login(req);
            return ResponseEntity.ok(resp);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(401).body(new ApiResponse(false, ex.getMessage()));
        }
    }
}
