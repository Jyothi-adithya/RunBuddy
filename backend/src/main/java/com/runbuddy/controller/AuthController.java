package com.runbuddy.controller;

import com.runbuddy.dto.UserDTO;
import com.runbuddy.entity.User;
import com.runbuddy.service.UserService;
import com.runbuddy.config.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager,
                          UserDetailsService userDetailsService,
                          JwtUtil jwtUtil,
                          UserService userService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody UserDTO dto) {
        if (dto.getUsername() == null || dto.getUsername().isBlank()) {
            throw new RuntimeException("Username is required");
        }
        User user = userService.register(dto);
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        return ResponseEntity.status(201).body(token);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody UserDTO dto) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(dto.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        return ResponseEntity.ok(token);
    }
}