package com.utility.billing.model;

import lombok.Data;

@Data
public class TariffSlab {
    private long min;
    private long max;
    private double rate;
}