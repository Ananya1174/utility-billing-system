package com.utility.payment.controller;

import com.utility.payment.dto.ConfirmOtpRequest;
import com.utility.payment.dto.InitiateOnlinePaymentRequest;
import com.utility.payment.dto.OfflinePaymentRequest;
import com.utility.payment.dto.PaymentResponse;
import com.utility.payment.dto.OutstandingResponse;
import com.utility.payment.model.Payment;
import com.utility.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService service;

    @PostMapping("/online/initiate")
    @ResponseStatus(HttpStatus.CREATED)
    public Payment initiateOnline(
            @Valid @RequestBody InitiateOnlinePaymentRequest request) {

        return service.initiateOnline(request);
    }

    @PostMapping("/online/confirm")
    public ResponseEntity<Map<String, String>> confirmOnline(
            @Valid @RequestBody ConfirmOtpRequest request) {

        service.confirmOtp(request);

        return ResponseEntity.ok(
                Map.of(
                        "status", "SUCCESS",
                        "message", "Payment confirmed successfully"
                )
        );
    }

    @PostMapping("/offline")
    public ResponseEntity<Map<String, String>> offlinePayment(
            @Valid @RequestBody OfflinePaymentRequest request) {

        service.offlinePayment(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "status", "SUCCESS",
                        "message", "Offline payment recorded successfully"
                ));
    }
    @GetMapping("/bill/{billId}")
    public List<PaymentResponse> getPaymentsByBill(
            @PathVariable String billId) {

        return service.getPaymentsByBill(billId);
    }
    @GetMapping("/outstanding/{billId}")
    public OutstandingResponse getOutstanding(
            @PathVariable String billId) {

        return service.getOutstanding(billId);
    }
}