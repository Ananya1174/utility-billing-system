package com.utility.billing.service;

import com.utility.billing.dto.BillResponse;
import com.utility.billing.dto.GenerateBillRequest;
import com.utility.billing.exception.ApiException;
import com.utility.billing.feign.MeterReadingClient;
import com.utility.billing.model.Bill;
import com.utility.billing.model.BillStatus;
import com.utility.billing.model.TariffSlab;
import com.utility.billing.repository.BillRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillingServiceImpl implements BillingService {

    private final BillRepository repository;
    private final MeterReadingClient meterClient;

    @Override
    @CircuitBreaker(name = "meterReadingCB", fallbackMethod = "meterFallback")
    public BillResponse generateBill(GenerateBillRequest request) {

    	long units = meterClient
    	        .getLatest(request.getConnectionId())
    	        .getConsumptionUnits();

    	if (units <= 0) {
    	    throw new ApiException("Invalid consumption units", HttpStatus.BAD_REQUEST);
    	}

        double energyCharge = calculateEnergyCharge(units);
        double fixedCharge = 50;
        double tax = energyCharge * 0.05;
        double total = energyCharge + fixedCharge + tax;

        Bill bill = new Bill();
        bill.setConsumerId(request.getConsumerId());
        bill.setConnectionId(request.getConnectionId());
        bill.setConsumptionUnits(units);
        bill.setEnergyCharge(energyCharge);
        bill.setFixedCharge(fixedCharge);
        bill.setTax(tax);
        bill.setTotalAmount(total);
        bill.setStatus(BillStatus.DUE);
        bill.setBillDate(LocalDate.now());
        bill.setDueDate(LocalDate.now().plusDays(15));

        repository.save(bill);
        return map(bill);
    }

    public BillResponse meterFallback(GenerateBillRequest request, Throwable t) {
        throw new ApiException("Meter service unavailable", HttpStatus.SERVICE_UNAVAILABLE);
    }

    @Override
    public List<BillResponse> getBillsByConsumer(String consumerId) {
        return repository.findByConsumerId(consumerId).stream().map(this::map).toList();
    }

    private double calculateEnergyCharge(long units) {
        if (units <= 100) return units * 2;
        if (units <= 300) return (100 * 2) + (units - 100) * 3;
        return (100 * 2) + (200 * 3) + (units - 300) * 5;
    }

    private BillResponse map(Bill bill) {
        BillResponse r = new BillResponse();
        r.setId(bill.getId());
        r.setConsumerId(bill.getConsumerId());
        r.setConnectionId(bill.getConnectionId());
        r.setConsumptionUnits(bill.getConsumptionUnits());
        r.setTotalAmount(bill.getTotalAmount());
        r.setStatus(bill.getStatus());
        r.setDueDate(bill.getDueDate());
        return r;
    }
}