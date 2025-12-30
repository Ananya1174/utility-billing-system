package com.utility.auth.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.utility.auth.dto.event.AccountApprovedEvent;
import com.utility.auth.dto.event.AccountRejectedEvent;
import com.utility.auth.dto.request.AccountRequestDto;
import com.utility.auth.dto.request.AccountRequestReviewDto;
import com.utility.auth.model.AccountRequest;
import com.utility.auth.model.AccountRequestStatus;
import com.utility.auth.model.Role;
import com.utility.auth.model.User;
import com.utility.auth.repository.AccountRequestRepository;
import com.utility.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountRequestService {

    private final AccountRequestRepository accountRequestRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationPublisher notificationPublisher;
    
    public AccountRequest createAccountRequest(AccountRequestDto dto) {

        if (accountRequestRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Account request already exists for this email");
        }

        AccountRequest request = AccountRequest.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .status(AccountRequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        return accountRequestRepository.save(request);
    }

    
    public List<AccountRequest> getPendingRequests() {
        return accountRequestRepository.findByStatus(AccountRequestStatus.PENDING);
    }

   
    public void reviewAccountRequest(
            AccountRequestReviewDto dto,
            String adminUsername) {

        AccountRequest request = accountRequestRepository.findById(dto.getRequestId())
                .orElseThrow(() -> new RuntimeException("Account request not found"));

        if (request.getStatus() != AccountRequestStatus.PENDING) {
            throw new RuntimeException("Request already reviewed");
        }

        if ("REJECT".equalsIgnoreCase(dto.getDecision())) {

            request.setStatus(AccountRequestStatus.REJECTED);
            request.setReviewedAt(LocalDateTime.now());
            request.setReviewedBy(adminUsername);

            accountRequestRepository.save(request);
            notificationPublisher.publishAccountRejected(
                    AccountRejectedEvent.builder()
                            .email(request.getEmail())
                            .build()
            );
            return;
        }

        if ("APPROVE".equalsIgnoreCase(dto.getDecision())) {

            String username = generateUsername(request.getEmail());
            String rawPassword = generateTempPassword();

            User user = User.builder()
                    .username(username)
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(rawPassword))
                    .role(Role.CONSUMER)
                    .active(true)
                    .passwordChangeRequired(true)
                    .build();

            userRepository.save(user);

            request.setStatus(AccountRequestStatus.APPROVED);
            request.setReviewedAt(LocalDateTime.now());
            request.setReviewedBy(adminUsername);
            accountRequestRepository.save(request);

                        notificationPublisher.publishAccountApproved(
                    AccountApprovedEvent.builder()
                            .email(request.getEmail())
                            .username(username)
                            .temporaryPassword(rawPassword)
                            .role("CONSUMER")
                            .build()
            );

            return;
        }

        throw new RuntimeException("Invalid decision. Use APPROVE or REJECT");
    }

    private String generateUsername(String email) {
        return email.split("@")[0];
    }

    private String generateTempPassword() {
        return UUID.randomUUID()
                .toString()
                .substring(0, 8);
    }
}