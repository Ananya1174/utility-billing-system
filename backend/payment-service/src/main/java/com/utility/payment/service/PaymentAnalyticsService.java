package com.utility.payment.service;

import com.utility.payment.dto.dashboard.*;
import com.utility.payment.model.Payment;
import com.utility.payment.model.PaymentMode;
import com.utility.payment.model.PaymentStatus;
import com.utility.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentAnalyticsService {

    private final PaymentRepository paymentRepository;


    public RevenueSummaryDto getMonthlyRevenue(int month, int year) {

        List<Payment> payments =
                paymentRepository.findByBillingMonthAndBillingYear(month, year)
                        .stream()
                        .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
                        .toList();

        double revenue = payments.stream()
                .mapToDouble(Payment::getAmount)
                .sum();

        return new RevenueSummaryDto(
                month,
                year,
                revenue,
                payments.size()
        );
    }

    public OutstandingSummaryDto getOutstandingSummary() {

        List<Payment> successPayments =
                paymentRepository.findByStatus(PaymentStatus.SUCCESS);

        double totalPaid = successPayments.stream()
                .mapToDouble(Payment::getAmount)
                .sum();

        return new OutstandingSummaryDto(
                0, 
                totalPaid,
                0  
        );
    }


    public List<PaymentModeSummaryDto> getRevenueByMode(int month, int year) {

        return paymentRepository
                .findByBillingMonthAndBillingYear(month, year)
                .stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
                .collect(Collectors.groupingBy(
                        Payment::getMode,
                        Collectors.summingDouble(Payment::getAmount)
                ))
                .entrySet()
                .stream()
                .map(e -> new PaymentModeSummaryDto(e.getKey(), e.getValue()))
                .toList();
    }

    public List<ConsumerPaymentSummaryDto> getConsumerPaymentSummary(
            int month,
            int year) {

        return paymentRepository
                .findByBillingMonthAndBillingYear(month, year)
                .stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
                .collect(Collectors.groupingBy(Payment::getConsumerId))
                .entrySet()
                .stream()
                .map(e -> new ConsumerPaymentSummaryDto(
                        e.getKey(),
                        e.getValue().size(),
                        e.getValue()
                                .stream()
                                .mapToDouble(Payment::getAmount)
                                .sum()
                ))
                .toList();
    }
}