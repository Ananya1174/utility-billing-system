package com.utility.payment.dto;

public record OfflinePaymentRequest(
        String billId,
        String consumerId,
        double amount,
        String remarks
) {}
