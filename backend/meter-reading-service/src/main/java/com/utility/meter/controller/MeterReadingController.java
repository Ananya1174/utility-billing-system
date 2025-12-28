package com.utility.meter.controller;

import com.utility.meter.dto.CreateMeterReadingRequest;
import com.utility.meter.dto.MeterReadingResponse;
import com.utility.meter.service.MeterReadingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/meter-readings")
@RequiredArgsConstructor
public class MeterReadingController {

    private final MeterReadingService service;

    @PostMapping
    public ResponseEntity<MeterReadingResponse> add(
            @Valid @RequestBody CreateMeterReadingRequest request) {

        MeterReadingResponse response = service.addReading(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/consumer/{consumerId}")
    public List<MeterReadingResponse> byConsumer(@PathVariable String consumerId) {
        return service.getByConsumer(consumerId);
    }

    @GetMapping("/month/{month}")
    public List<MeterReadingResponse> byMonth(@PathVariable String month) {
        return service.getByMonth(month);
    }

    @GetMapping("/latest/{connectionId}")
    public MeterReadingResponse latest(@PathVariable String connectionId) {
        return service.getLatest(connectionId);
    }
}