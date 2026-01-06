package com.utility.billing.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DashboardConsumptionResponse {
    private List<UtilityConsumptionDto> byUtility;
    private List<MonthlyConsumptionDto> monthly;
}