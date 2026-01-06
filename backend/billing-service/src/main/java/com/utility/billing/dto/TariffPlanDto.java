package com.utility.billing.dto;

import java.util.List;

import com.utility.billing.model.UtilityType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor

public class TariffPlanDto {
	 private UtilityType utilityType;
    private String planCode;
    
}