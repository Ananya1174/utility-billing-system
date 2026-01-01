package com.utility.payment.dto;

import java.time.LocalDate;
import lombok.Data;
@Data
public class BillResponse {

    private String id;
    private String consumerId;
    private String connectionId;
    private double tax;
    private double penalty;

    private double totalAmount;
    private String status;

    private int billingMonth;
    private int billingYear;

    private LocalDate dueDate;
}