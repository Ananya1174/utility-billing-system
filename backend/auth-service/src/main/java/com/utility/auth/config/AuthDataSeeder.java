package com.utility.auth.config;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.utility.auth.model.Role;
import com.utility.auth.model.User;
import com.utility.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class AuthDataSeeder {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedAuthUsers(UserRepository userRepository) {

        return args -> {

            if (userRepository.count() > 0) {
                System.out.println("Auth users already exist. Skipping seed.");
                return;
            }

            User admin = User.builder()
                    .username("admin")
                    .email("admin@ubs.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .passwordChangeRequired(false)
                    .build();

            User billingOfficer = User.builder()
                    .username("billing")
                    .email("billing@ubs.com")
                    .password(passwordEncoder.encode("Billing@123"))
                    .role(Role.BILLING_OFFICER)
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .passwordChangeRequired(false)
                    .build();

            User accountsOfficer = User.builder()
                    .username("accounts")
                    .email("accounts@ubs.com")
                    .password(passwordEncoder.encode("Accounts@123"))
                    .role(Role.ACCOUNTS_OFFICER)
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .passwordChangeRequired(false)
                    .build();

            userRepository.saveAll(
                    List.of(admin, billingOfficer, accountsOfficer)
            );

            System.out.println("Default admin users seeded successfully");
        };
    }
}