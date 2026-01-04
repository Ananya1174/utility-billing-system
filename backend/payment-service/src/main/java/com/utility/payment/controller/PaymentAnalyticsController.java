package com.utility.payment.controller;

import com.utility.payment.dto.dashboard.*;
import com.utility.payment.service.PaymentAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dashboard/payments")
@RequiredArgsConstructor
public class PaymentAnalyticsController {

    private final PaymentAnalyticsService analyticsService;

    @GetMapping("/revenue-summary")
    public RevenueSummaryDto revenueSummary(
            @RequestParam int month,
            @RequestParam int year) {

        return analyticsService.getMonthlyRevenue(month, year);
    }

    @GetMapping("/outstanding-summary")
    public OutstandingSummaryDto outstandingSummary() {

        return analyticsService.getOutstandingSummary();
    }

    @GetMapping("/payments-summary")
    public PaymentsSummaryDto paymentsSummary(
            @RequestParam int month,
            @RequestParam int year) {

        return analyticsService.getPaymentsSummary(month, year);
    }

    @GetMapping("/failed-summary")
    public FailedPaymentSummaryDto failedPayments(
            @RequestParam int month,
            @RequestParam int year) {

        return analyticsService.getFailedPaymentsSummary(month, year);
    }
    @GetMapping("/outstanding-monthly")
    public List<MonthlyOutstandingDto> monthlyOutstanding(
            @RequestParam int year
    ) {
        return analyticsService.getMonthlyOutstanding(year);
    }

    @GetMapping("/revenue-by-mode")
    public List<PaymentModeSummaryDto> revenueByMode(
            @RequestParam int month,
            @RequestParam int year) {

        return analyticsService.getRevenueByMode(month, year);
    }

    @GetMapping("/consumer-summary")
    public List<ConsumerPaymentSummaryDto> consumerPaymentSummary(
            @RequestParam int month,
            @RequestParam int year) {

        return analyticsService.getConsumerPaymentSummary(month, year);
    }

    @GetMapping("/revenue-yearly")
    public List<RevenueSummaryDto> yearlyRevenue(
            @RequestParam int year) {

        return analyticsService.getYearlyRevenue(year);
    }
}