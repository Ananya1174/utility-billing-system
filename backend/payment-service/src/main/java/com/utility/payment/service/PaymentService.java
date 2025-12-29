package com.utility.payment.service;

import com.utility.payment.dto.ConfirmOtpRequest;
import com.utility.payment.dto.InitiateOnlinePaymentRequest;
import com.utility.payment.dto.OfflinePaymentRequest;
import com.utility.payment.dto.OutstandingResponse;
import com.utility.payment.exception.ApiException;
import com.utility.payment.feign.BillingClient;
import com.utility.payment.model.Payment;
import com.utility.payment.model.PaymentMode;
import com.utility.payment.model.PaymentStatus;
import com.utility.payment.repository.PaymentRepository;
import com.utility.payment.dto.PaymentResponse;

import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository repository;
    private final BillingClient billingClient;


    public Payment initiateOnline(InitiateOnlinePaymentRequest request) {

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        Payment payment = new Payment();
        payment.setBillId(request.billId());
        payment.setConsumerId(request.consumerId());
        payment.setAmount(request.amount());
        payment.setMode(PaymentMode.ONLINE);
        payment.setStatus(PaymentStatus.INITIATED);
        payment.setOtp(otp);
        payment.setOtpExpiry(Instant.now().plusSeconds(300));
        payment.setCreatedAt(LocalDateTime.now());

        repository.save(payment);

        System.out.println("OTP sent to email: " + otp);

        return payment;
    }

    public void confirmOtp(ConfirmOtpRequest request) {

        Payment payment = repository.findById(request.paymentId())
                .orElseThrow(() ->
                        new ApiException("Payment not found", HttpStatus.NOT_FOUND)
                );

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

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setConfirmedAt(LocalDateTime.now());
        repository.save(payment);

        billingClient.markPaid(payment.getBillId());
    }

   

    public void offlinePayment(OfflinePaymentRequest request) {

        Payment payment = new Payment();
        payment.setBillId(request.billId());
        payment.setConsumerId(request.consumerId());
        payment.setAmount(request.amount());
        payment.setMode(PaymentMode.OFFLINE);
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setConfirmedAt(LocalDateTime.now());
        payment.setCreatedAt(LocalDateTime.now());

        repository.save(payment);

        try {
            billingClient.markPaid(request.billId());
        } catch (FeignException.BadRequest e) {
            throw new ApiException("Bill already paid", HttpStatus.BAD_REQUEST);
        }
    }
    public List<PaymentResponse> getPaymentsByBill(String billId) {

        return repository.findByBillId(billId)
                .stream()
                .map(p -> new PaymentResponse(
                        p.getId(),
                        p.getBillId(),
                        p.getConsumerId(),
                        p.getAmount(),
                        p.getMode(),
                        p.getStatus(),
                        p.getCreatedAt(),
                        p.getConfirmedAt()
                ))
                .toList();
    }
    public OutstandingResponse getOutstanding(String billId) {

        var bill = billingClient.getBill(billId);

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
}