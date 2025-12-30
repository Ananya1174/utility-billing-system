package com.utility.payment.controller;

import com.utility.payment.dto.*;
import com.utility.payment.model.Invoice;
import com.utility.payment.service.InvoicePdfService;
import com.utility.payment.service.InvoiceService;
import com.utility.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final InvoiceService invoiceService;
    private final InvoicePdfService invoicePdfService;

    // ================= ONLINE PAYMENT =================

    @PostMapping("/online/initiate")
    @ResponseStatus(HttpStatus.CREATED)
    public PaymentResponse initiateOnline(
            @Valid @RequestBody InitiateOnlinePaymentRequest request) {

        return paymentService.initiateOnline(request);
    }

    @PostMapping("/online/confirm")
    public ResponseEntity<Map<String, String>> confirmOnline(
            @Valid @RequestBody ConfirmOtpRequest request) {

        paymentService.confirmOtp(request);

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Payment confirmed successfully"
        ));
    }

    // ================= OFFLINE PAYMENT =================

    @PostMapping("/offline")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> offlinePayment(
            @Valid @RequestBody OfflinePaymentRequest request) {

        paymentService.offlinePayment(request);

        return Map.of(
                "status", "SUCCESS",
                "message", "Offline payment recorded successfully"
        );
    }

    // ================= PAYMENT HISTORY =================

    // 🔹 Payments for a bill
    @GetMapping("/bill/{billId}")
    public List<PaymentResponse> getPaymentsByBill(
            @PathVariable String billId) {

        return paymentService.getPaymentsByBill(billId);
    }

    // 🔹 Payments for a consumer
    @GetMapping("/consumer/{consumerId}")
    public List<PaymentResponse> getPaymentsByConsumer(
            @PathVariable String consumerId) {

        return paymentService.getPaymentsByConsumer(consumerId);
    }

    // ================= OUTSTANDING =================

    @GetMapping("/outstanding/{billId}")
    public OutstandingResponse outstanding(
            @PathVariable String billId) {

        return paymentService.getOutstanding(billId);
    }

    // ================= INVOICE =================

    // 🔹 View invoice details
    @GetMapping("/invoice/{paymentId}")
    public Invoice getInvoice(@PathVariable String paymentId) {

        return invoiceService.getInvoiceByPaymentId(paymentId);
    }

    // 🔹 Download invoice PDF
    @GetMapping("/invoice/{paymentId}/download")
    public ResponseEntity<byte[]> downloadInvoice(
            @PathVariable String paymentId) {

        byte[] pdf = invoicePdfService.generateInvoicePdf(paymentId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=invoice-" + paymentId + ".pdf")
                .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
                .body(pdf);
    }
}