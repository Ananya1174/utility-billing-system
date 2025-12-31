package com.utility.consumer.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.utility.consumer.enums.ConnectionRequestStatus;
import com.utility.consumer.enums.UtilityType;

import lombok.Data;

@Document(collection = "connection_requests")
@Data
public class ConnectionRequest {

    @Id
    private String id;

    private String consumerId;

    private UtilityType utilityType;

    // 🔑 Reference to billing tariff plan (STRING, not enum)
    private String tariffPlanCode;

    private ConnectionRequestStatus status; // PENDING / APPROVED / REJECTED

    private LocalDateTime requestedAt;
    private LocalDateTime reviewedAt;

    // Admin info
    private String reviewedBy;
    private String rejectionReason;
}