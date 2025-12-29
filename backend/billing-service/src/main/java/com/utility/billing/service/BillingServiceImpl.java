package com.utility.billing.service;

import com.utility.billing.dto.BillResponse;
import com.utility.billing.dto.GenerateBillRequest;
import com.utility.billing.exception.ApiException;
import com.utility.billing.feign.MeterReadingClient;
import com.utility.billing.model.Bill;
import com.utility.billing.model.BillStatus;
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

    private final BillRepository billRepository;
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

        billRepository.save(bill);

        return map(bill);
    }
  
       public BillResponse meterFallback(GenerateBillRequest request, Throwable ex) {
        throw new ApiException(
                "Meter service unavailable. Please try again later.",
                HttpStatus.SERVICE_UNAVAILABLE
        );
    }

    
    @Override
    public List<BillResponse> getBillsByConsumer(String consumerId) {
        return billRepository.findByConsumerId(consumerId)
                .stream()
                .map(this::map)
                .toList();
    }

    
    @Override
    public void markBillAsPaid(String billId) {

        Bill bill = billRepository.findById(billId)
                .orElseThrow(() ->
                        new ApiException("Bill not found", HttpStatus.NOT_FOUND)
                );

        if (bill.getStatus() == BillStatus.PAID) {
            throw new ApiException("Bill already paid", HttpStatus.BAD_REQUEST);
        }

        bill.setStatus(BillStatus.PAID);
        billRepository.save(bill);
    }

    
    private double calculateEnergyCharge(long units) {
        if (units <= 100) return units * 2;
        if (units <= 300) return (100 * 2) + (units - 100) * 3;
        return (100 * 2) + (200 * 3) + (units - 300) * 5;
    }

    private BillResponse map(Bill bill) {
        BillResponse response = new BillResponse();
        response.setId(bill.getId());
        response.setConsumerId(bill.getConsumerId());
        response.setConnectionId(bill.getConnectionId());
        response.setConsumptionUnits(bill.getConsumptionUnits());
        response.setTotalAmount(bill.getTotalAmount());
        response.setStatus(bill.getStatus());
        response.setDueDate(bill.getDueDate());
        return response;
    }
    @Override
    public BillResponse getBillById(String billId) {

        Bill bill = billRepository.findById(billId)
                .orElseThrow(() ->
                        new ApiException("Bill not found", HttpStatus.NOT_FOUND));

        return map(bill);
    }
}