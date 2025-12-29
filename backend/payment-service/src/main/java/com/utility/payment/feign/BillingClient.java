package com.utility.payment.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PutMapping;

import com.utility.payment.dto.BillResponse;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
	    name = "billing-service",
	    configuration = FeignSecurityConfig.class
	)
	public interface BillingClient {

	    @PutMapping("/bills/{billId}/mark-paid")
	    void markPaid(@PathVariable String billId);
	    
	    @GetMapping("/bills/{billId}")
	    BillResponse getBill(@PathVariable String billId);
	}