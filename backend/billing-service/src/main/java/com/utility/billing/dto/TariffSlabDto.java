package com.utility.billing.dto;

import com.utility.billing.model.UtilityType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TariffSlabDto {

    private UtilityType utilityType;
    private String planCode;

    private long minUnits;
    private long maxUnits;
    private double rate;
}