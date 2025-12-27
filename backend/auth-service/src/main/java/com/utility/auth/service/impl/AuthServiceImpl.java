package com.utility.auth.service.impl;

import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.utility.auth.dto.response.LoginResponseDto;
import com.utility.auth.exception.ResourceNotFoundException;
import com.utility.auth.exception.UserAlreadyExistsException;
import com.utility.auth.model.PasswordResetToken;
import com.utility.auth.model.User;
import com.utility.auth.repository.PasswordResetTokenRepository;
import com.utility.auth.repository.UserRepository;
import com.utility.auth.security.JwtUtil;
import com.utility.auth.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
	
	private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Override
    public User registerUser(User user) {

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setActive(true);

        return userRepository.save(user);
    }
    @Override
    public LoginResponseDto login(String username, String password) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));

        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        String token = jwtUtil.generateToken(username, user.getRole().name());

        return new LoginResponseDto(token, "Bearer", user.getRole().name());
    }
    @Override
    public void forgotPassword(String email) {

        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String token = java.util.UUID.randomUUID().toString();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .email(user.getEmail())
                .token(token)
                .expiryDate(LocalDateTime.now().plusMinutes(30))
                .used(false)
                .build();

        passwordResetTokenRepository.save(resetToken);

        // Later → publish event to RabbitMQ
        System.out.println("Password reset token: " + token);
    }

    @Override
    public void resetPassword(String token, String newPassword) {

        PasswordResetToken resetToken =
                passwordResetTokenRepository.findByToken(token)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Invalid reset token"));

        if (Boolean.TRUE.equals(resetToken.getUsed())
                || resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Reset token is expired or already used");
        }

        User user = userRepository.findByEmail(resetToken.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }
}