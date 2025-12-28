package com.utility.billing.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GenerateBillRequest {

    @NotBlank
    private String consumerId;

    @NotBlank
    private String connectionId;
}