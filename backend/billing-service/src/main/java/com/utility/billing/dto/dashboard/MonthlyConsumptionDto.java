package com.utility.billing.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlyConsumptionDto {
    private int month;
    private long units;
}