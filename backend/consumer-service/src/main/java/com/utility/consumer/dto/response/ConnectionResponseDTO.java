package com.utility.consumer.dto.response;

import com.utility.consumer.enums.TariffPlan;
import com.utility.consumer.enums.UtilityType;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ConnectionResponseDTO {
    private String id;
    private UtilityType utilityType;
    private String meterNumber;
    private TariffPlan tariffPlan;
    private boolean active;
}
