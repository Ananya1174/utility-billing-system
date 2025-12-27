package com.utility.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.utility.auth.dto.request.RegisterRequestDto;
import com.utility.auth.dto.response.RegisterResponseDto;
import com.utility.auth.model.Role;
import com.utility.auth.model.User;
import com.utility.auth.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDto> registerUser(
            @Valid @RequestBody RegisterRequestDto request) {

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(Role.valueOf(request.getRole()))
                .build();

        User savedUser = authService.registerUser(user);

        RegisterResponseDto response =
                new RegisterResponseDto(savedUser.getUserId(), "User registered successfully");

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}