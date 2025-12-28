package com.utility.consumer.model;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.utility.consumer.enums.TariffPlan;
import com.utility.consumer.enums.UtilityType;

import lombok.Data;

@Document(collection = "utility_connections")
@Data
public class UtilityConnection {

    @Id
    private String id;

    @NotBlank
    private String consumerId;

    @NotBlank
    private UtilityType utilityType;
    @NotBlank
    private String meterNumber;

    @NotBlank
    private TariffPlan tariffPlan;      

    private boolean active = true;

    private LocalDateTime createdAt;
}
