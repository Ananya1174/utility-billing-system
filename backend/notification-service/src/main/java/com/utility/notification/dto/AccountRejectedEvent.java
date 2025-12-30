package com.utility.notification.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AccountRejectedEvent {
    private String email;
}