package com.utility.billing.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
	    name = "meter-reading-service",
	    fallback = MeterReadingFallback.class
	)
	public interface MeterReadingClient {
	    @GetMapping("/meter-readings/latest/{connectionId}")
	    MeterReadingResponse getLatest(@PathVariable String connectionId);
	}