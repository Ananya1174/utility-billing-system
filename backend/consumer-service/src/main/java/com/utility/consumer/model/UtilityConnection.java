package com.utility.consumer.model;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "utility_connections")
@Data
public class UtilityConnection {

    @Id
    private String id;

    @NotBlank
    private String consumerId;

    @NotBlank
    private String utilityType; // ELECTRICITY, WATER, GAS

    @NotBlank
    private String meterNumber;

    @NotBlank
    private String tariffPlan;

    private boolean active = true;

    private LocalDateTime createdAt;
}
