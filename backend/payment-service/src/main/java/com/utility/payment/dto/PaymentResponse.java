package com.utility.payment.dto;

import com.utility.payment.model.Payment;
import com.utility.payment.model.PaymentMode;
import com.utility.payment.model.PaymentStatus;

import java.time.LocalDateTime;

public record PaymentResponse(
        String paymentId,
        String billId,
        String consumerId,
        double amount,
        PaymentMode mode,
        PaymentStatus status,
        LocalDateTime createdAt,
        LocalDateTime confirmedAt
) {
    public static PaymentResponse from(Payment p) {
        return new PaymentResponse(
                p.getId(),
                p.getBillId(),
                p.getConsumerId(),
                p.getAmount(),
                p.getMode(),
                p.getStatus(),
                p.getCreatedAt(),
                p.getConfirmedAt()
        );
    }
}