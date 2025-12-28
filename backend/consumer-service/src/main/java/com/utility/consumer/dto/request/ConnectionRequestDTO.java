package com.utility.consumer.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ConnectionRequestDTO {

    @NotBlank
    private String consumerId;

    @NotBlank
    private String utilityType;

    @NotBlank
    private String meterNumber;

    @NotBlank
    private String tariffPlan;
}
