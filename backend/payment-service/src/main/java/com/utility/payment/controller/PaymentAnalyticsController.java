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
}