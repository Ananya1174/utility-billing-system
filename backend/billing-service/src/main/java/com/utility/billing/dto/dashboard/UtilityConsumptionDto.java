package com.utility.billing.dto.dashboard;

import com.utility.billing.model.UtilityType;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UtilityConsumptionDto {
    private UtilityType utilityType;
    private long units;
}