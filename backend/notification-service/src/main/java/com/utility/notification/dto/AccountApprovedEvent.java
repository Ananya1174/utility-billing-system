package com.utility.notification.dto;

import lombok.Data;

@Data
public class AccountApprovedEvent {
    private String email;
    private String username;
    private String temporaryPassword;
    private String role;
}