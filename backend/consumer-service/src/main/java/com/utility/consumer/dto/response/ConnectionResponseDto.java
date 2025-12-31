package com.utility.consumer.dto.response;

import com.utility.consumer.enums.UtilityType;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ConnectionResponseDto {

    private String id;
    private UtilityType utilityType;
    private String meterNumber;
    private String tariffPlanCode;
    private boolean active;
}