package com.utility.billing.dto;

import com.utility.billing.model.BillStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BillResponse {

    private String id;
    private String consumerId;
    private String connectionId;
    private long consumptionUnits;
    private double totalAmount;
    private BillStatus status;
    private LocalDate dueDate;
}