package com.utility.payment.feign;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;


import com.utility.payment.dto.BillResponse;
import com.utility.payment.model.BillStatus;

@FeignClient(
    name = "billing-service",
    configuration = FeignSecurityConfig.class
)
public interface BillingClient {

    @PutMapping("/bills/{billId}/mark-paid")
    void markPaid(@PathVariable String billId);

    @GetMapping("/bills/{billId}")
    BillResponse getBill(@PathVariable String billId);

    // ✅ ADD THIS (matches controller exactly)
    @GetMapping("/bills")
    List<BillResponse> getAllBills(
        @RequestParam(required = false) BillStatus status,
        @RequestParam(required = false) Integer month,
        @RequestParam(required = false) Integer year,
        @RequestParam(required = false) String consumerId
    );
    @GetMapping("/dashboard/billing/total-billed")
    double getTotalBilled();
    @GetMapping("/dashboard/billing/total-billed-monthly")
    double getTotalBilledForMonth(
            @RequestParam int month,
            @RequestParam int year
    );
}