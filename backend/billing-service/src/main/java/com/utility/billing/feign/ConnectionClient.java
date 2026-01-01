package com.utility.billing.feign;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@FeignClient(
	    name = "consumer-service",
	    contextId = "connectionClient",
	    path = "/connections"
	)
	public interface ConnectionClient {

	    @GetMapping("/{id}")
	    ConsumerConnectionResponse getConnectionById(
	            @PathVariable String id
	    );
	}