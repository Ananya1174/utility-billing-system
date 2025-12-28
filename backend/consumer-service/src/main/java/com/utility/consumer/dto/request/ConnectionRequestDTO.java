package com.utility.consumer.dto.request;

import com.utility.consumer.enums.TariffPlan;
import com.utility.consumer.enums.UtilityType;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ConnectionRequestDTO {

    @NotBlank
    private String consumerId;

    @NotBlank
    private UtilityType utilityType;

    @NotBlank
    private String meterNumber;

    @NotBlank
    private TariffPlan tariffPlan;
}
