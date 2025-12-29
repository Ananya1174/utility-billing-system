package com.utility.payment.controller;

import com.utility.payment.dto.ConfirmOtpRequest;
import com.utility.payment.dto.InitiateOnlinePaymentRequest;
import com.utility.payment.model.Payment;
import com.utility.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService service;

    @PostMapping("/online/initiate")
    @ResponseStatus(HttpStatus.CREATED)
    public Payment initiate(@Valid @RequestBody InitiateOnlinePaymentRequest request) {
        return service.initiateOnline(request);
    }

    @PostMapping("/online/confirm")
    public void confirm(@Valid @RequestBody ConfirmOtpRequest request) {
        service.confirmOtp(request);
    }

    @PostMapping("/offline")
    @ResponseStatus(HttpStatus.CREATED)
    public void offline(@RequestParam String billId,
                        @RequestParam String consumerId,
                        @RequestParam double amount) {
        service.offlinePayment(billId, consumerId, amount);
    }
}