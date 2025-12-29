package com.utility.payment.controller;

import com.utility.payment.dto.*;
import com.utility.payment.model.Payment;
import com.utility.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService service;

    @PostMapping("/online/initiate")
    @ResponseStatus(HttpStatus.CREATED)
    public Payment initiateOnline(@Valid @RequestBody InitiateOnlinePaymentRequest request) {
        return service.initiateOnline(request);
    }

    @PostMapping("/online/confirm")
    public ResponseEntity<Map<String, String>> confirmOnline(
            @Valid @RequestBody ConfirmOtpRequest request) {

        service.confirmOtp(request);

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Payment confirmed successfully"
        ));
    }

    @PostMapping("/offline")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> offlinePayment(
            @Valid @RequestBody OfflinePaymentRequest request) {

        service.offlinePayment(request);

        return Map.of(
                "status", "SUCCESS",
                "message", "Offline payment recorded successfully"
        );
    }

    @GetMapping("/bill/{billId}")
    public List<PaymentResponse> getPayments(@PathVariable String billId) {
        return service.getPaymentsByBill(billId);
    }

    @GetMapping("/outstanding/{billId}")
    public OutstandingResponse outstanding(@PathVariable String billId) {
        return service.getOutstanding(billId);
    }
}