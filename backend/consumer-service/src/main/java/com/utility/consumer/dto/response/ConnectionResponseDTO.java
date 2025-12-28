package com.utility.consumer.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ConnectionResponseDTO {
    private String id;
    private String utilityType;
    private String meterNumber;
    private String tariffPlan;
    private boolean active;
}
