package com.utility.payment.service;

import com.utility.payment.dto.*;
import com.utility.payment.exception.ApiException;
import com.utility.payment.feign.BillingClient;
import com.utility.payment.model.Invoice;
import com.utility.payment.model.Payment;
import com.utility.payment.model.PaymentMode;
import com.utility.payment.model.PaymentStatus;
import com.utility.payment.repository.InvoiceRepository;
import com.utility.payment.repository.PaymentRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository repository;
    private final BillingClient billingClient;
    private final InvoiceRepository invoiceRepository;

    // ---------------- ONLINE PAYMENT ----------------
    public PaymentResponse initiateOnline(InitiateOnlinePaymentRequest request) {

        BillResponse bill = billingClient.getBill(request.billId());

        if ("PAID".equalsIgnoreCase(bill.getStatus())) {
            throw new ApiException("Bill already paid", HttpStatus.BAD_REQUEST);
        }

        double totalPaid = repository.findByBillId(request.billId()).stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
                .mapToDouble(Payment::getAmount)
                .sum();

        double outstanding = bill.getTotalAmount() - totalPaid;

        if (outstanding <= 0) {
            throw new ApiException("No outstanding amount", HttpStatus.BAD_REQUEST);
        }

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        Payment payment = new Payment();
        payment.setBillId(request.billId());
        payment.setConsumerId(request.consumerId());
        payment.setAmount(outstanding);
        payment.setMode(PaymentMode.ONLINE);
        payment.setStatus(PaymentStatus.INITIATED);
        payment.setOtp(otp);
        payment.setOtpExpiry(Instant.now().plusSeconds(300));
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setCreatedAt(LocalDateTime.now());

        repository.save(payment);

        // simulate OTP send
        System.out.println("OTP: " + otp);

        return PaymentResponse.from(payment);
    }

    // ---------------- CONFIRM OTP ----------------
    public PaymentResponse confirmOtp(ConfirmOtpRequest request) {

        Payment payment = repository.findById(request.paymentId())
                .orElseThrow(() -> new ApiException("Payment not found", HttpStatus.NOT_FOUND));

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            throw new ApiException("Payment already completed", HttpStatus.BAD_REQUEST);
        }

        if (payment.getOtpExpiry().isBefore(Instant.now())) {
            payment.setStatus(PaymentStatus.FAILED);
            repository.save(payment);
            throw new ApiException("OTP expired", HttpStatus.BAD_REQUEST);
        }

        if (!payment.getOtp().equals(request.otp())) {
            payment.setStatus(PaymentStatus.FAILED);
            repository.save(payment);
            throw new ApiException("Invalid OTP", HttpStatus.BAD_REQUEST);
        }

        // Mark payment success
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setConfirmedAt(LocalDateTime.now());
        repository.save(payment);

        // Mark bill paid
        billingClient.markPaid(payment.getBillId());

        // Generate invoice
        generateInvoice(payment);

        return PaymentResponse.from(payment);
    }

    // ---------------- OFFLINE PAYMENT ----------------
    public PaymentResponse offlinePayment(OfflinePaymentRequest request) {

        BillResponse bill = billingClient.getBill(request.billId());

        if ("PAID".equalsIgnoreCase(bill.getStatus())) {
            throw new ApiException("Bill already paid", HttpStatus.BAD_REQUEST);
        }

        double totalPaid = repository.findByBillId(request.billId()).stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
                .mapToDouble(Payment::getAmount)
                .sum();

        double outstanding = bill.getTotalAmount() - totalPaid;

        if (outstanding <= 0) {
            throw new ApiException("No outstanding amount", HttpStatus.BAD_REQUEST);
        }

        billingClient.markPaid(request.billId());

        Payment payment = new Payment();
        payment.setBillId(request.billId());
        payment.setConsumerId(request.consumerId());
        payment.setAmount(outstanding);
        payment.setMode(PaymentMode.OFFLINE);
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setRemarks(request.remarks());
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setCreatedAt(LocalDateTime.now());
        payment.setConfirmedAt(LocalDateTime.now());

        repository.save(payment);

        generateInvoice(payment);

        return PaymentResponse.from(payment);
    }
 // ---------------- OUTSTANDING ----------------
    public OutstandingResponse getOutstanding(String billId) {

        BillResponse bill = billingClient.getBill(billId);

        double totalPaid = repository.findByBillId(billId)
                .stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
                .mapToDouble(Payment::getAmount)
                .sum();

        double outstanding = bill.getTotalAmount() - totalPaid;

        return new OutstandingResponse(
                billId,
                bill.getTotalAmount(),
                totalPaid,
                Math.max(outstanding, 0)
        );
    }

    // ---------------- PAYMENT HISTORY ----------------
    public List<PaymentResponse> getPaymentsByConsumer(String consumerId) {
        return repository.findByConsumerIdOrderByCreatedAtDesc(consumerId)
                .stream()
                .map(PaymentResponse::from)
                .toList();
    }

    public List<PaymentResponse> getPaymentsByBill(String billId) {
        return repository.findByBillId(billId)
                .stream()
                .map(PaymentResponse::from)
                .toList();
    }

    // ---------------- INVOICE ----------------
    private void generateInvoice(Payment payment) {

    	Invoice invoice = new Invoice();

    	invoice.setInvoiceNumber("INV-" + System.currentTimeMillis());
    	invoice.setBillId(payment.getBillId());
    	invoice.setPaymentId(payment.getId());
    	invoice.setConsumerId(payment.getConsumerId());

    	invoice.setAmountPaid(payment.getAmount());
    	invoice.setTax(0);        // can be fetched from bill later
    	invoice.setPenalty(0);    // already applied in bill
    	invoice.setTotalAmount(payment.getAmount());

    	invoice.setInvoiceDate(LocalDateTime.now());

    	invoiceRepository.save(invoice);
    }
}