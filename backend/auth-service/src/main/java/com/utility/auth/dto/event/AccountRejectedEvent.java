package com.utility.auth.dto.event;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AccountRejectedEvent {
    private String email;
}