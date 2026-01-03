package com.utility.billing.feign;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import com.utility.billing.exception.ApiException;

@Component
public class MeterReadingFallback implements MeterReadingClient {

    @Override
    public MeterReadingResponse getLatest(String connectionId) {
        return null; 
    }
}