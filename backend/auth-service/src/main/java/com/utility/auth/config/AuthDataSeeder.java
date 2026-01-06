package com.utility.auth.config;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.utility.auth.model.AccountRequest;
import com.utility.auth.model.AccountRequestStatus;
import com.utility.auth.model.Role;
import com.utility.auth.model.User;
import com.utility.auth.repository.AccountRequestRepository;
import com.utility.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@EnableScheduling
@RequiredArgsConstructor
public class AuthDataSeeder {

    private static final String DEFAULT_PASSWORD = "ChangeMe@123";

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final AccountRequestRepository accountRequestRepository;

    private boolean seeded = false;

    @Scheduled(initialDelay = 15000, fixedDelay = 60000)
    public void seedAuthData() {

        if (seeded || userRepository.count() > 0) {
            return;
        }

        List<User> users = new ArrayList<>();
        List<AccountRequest> requests = new ArrayList<>();

        users.add(buildUser("admin", "admin@ubs.com", Role.ADMIN, false));
        users.add(buildUser("billing", "billing@ubs.com", Role.BILLING_OFFICER, false));
        users.add(buildUser("accounts", "accounts@ubs.com", Role.ACCOUNTS_OFFICER, false));

        for (int i = 1; i <= 10; i++) {

            String email = "consumer" + i + "@mail.com";

            users.add(
                    User.builder()
                            .username("consumer" + i)
                            .email(email)
                            .password(passwordEncoder.encode(DEFAULT_PASSWORD))
                            .role(Role.CONSUMER)
                            .active(true)
                            .createdAt(LocalDateTime.now().minusDays(30))
                            .passwordChangeRequired(true)
                            .build()
            );

            requests.add(
                    AccountRequest.builder()
                            .name("Consumer " + i)
                            .email(email)
                            .phone("90000000" + i)
                            .address("City Sector " + i)
                            .status(AccountRequestStatus.APPROVED)
                            .createdAt(LocalDateTime.now().minusDays(35))
                            .reviewedAt(LocalDateTime.now().minusDays(30))
                            .reviewedBy("system-seeder")
                            .build()
            );
        }

        userRepository.saveAll(users);
        accountRequestRepository.saveAll(requests);

        seeded = true;
    }

    private User buildUser(
            String username,
            String email,
            Role role,
            boolean passwordChangeRequired
    ) {
        return User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(DEFAULT_PASSWORD))
                .role(role)
                .active(true)
                .createdAt(LocalDateTime.now())
                .passwordChangeRequired(passwordChangeRequired)
                .build();
    }
}