package com.utility.billing.controller;

import com.utility.billing.dto.BillResponse;
import com.utility.billing.dto.GenerateBillRequest;
import com.utility.billing.model.BillStatus;
import com.utility.billing.service.BillingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bills")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService service;

    @PostMapping
    public ResponseEntity<BillResponse> generate(@Valid @RequestBody GenerateBillRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.generateBill(request));
    }

    @GetMapping("/consumer/{consumerId}")
    public List<BillResponse> byConsumer(@PathVariable String consumerId) {
        return service.getBillsByConsumer(consumerId);
    }
    @PutMapping("/{billId}/mark-paid")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markBillAsPaid(@PathVariable String billId) {
        service.markBillAsPaid(billId);
    }
    @GetMapping("/{billId}")
    public BillResponse getBillById(@PathVariable String billId) {
        return service.getBillById(billId);
    }
    @GetMapping
    public List<BillResponse> getAllBills(
            @RequestParam(required = false) BillStatus status,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String consumerId
    ) {
        return service.getAllBills(status, month, year, consumerId);
    }
    
}