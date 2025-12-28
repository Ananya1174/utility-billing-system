package com.utility.billing.feign;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MeterReadingResponse {

    private String id;
    private String consumerId;
    private String connectionId;
    private String utilityType;
    private String meterNumber;
    private int previousReading;
    private int currentReading;
    private int consumptionUnits;
    private LocalDateTime readingDate;
}
