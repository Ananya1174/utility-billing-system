package com.utility.payment.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "billing-service")
public interface BillingClient {

    @PutMapping("/bills/{billId}/mark-paid")
    void markPaid(@PathVariable String billId);
}