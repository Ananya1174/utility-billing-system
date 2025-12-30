package com.utility.billing.service;

import com.utility.billing.dto.BillResponse;
import com.utility.billing.dto.GenerateBillRequest;
import com.utility.billing.exception.ApiException;
import com.utility.billing.feign.MeterReadingClient;
import com.utility.billing.feign.MeterReadingResponse;
import com.utility.billing.model.Bill;
import com.utility.billing.model.BillStatus;
import com.utility.billing.model.TariffSlab;
import com.utility.billing.repository.BillRepository;
import com.utility.billing.repository.TariffSlabRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillingService {

    private final BillRepository billRepository;
    private final MeterReadingClient meterClient;
    private final TariffSlabRepository slabRepository;

    @CircuitBreaker(name = "meterReadingCB", fallbackMethod = "meterFallback")
    public MeterReadingResponse fetchLatestMeterReading(String connectionId) {
        return meterClient.getLatest(connectionId);
    }

    // ✅ FALLBACK
    public MeterReadingResponse meterFallback(String connectionId, Throwable ex) {
        return null; // IMPORTANT – handled in business logic
    }
    public BillResponse generateBill(GenerateBillRequest request) {
    	var lastBillOpt =
                billRepository.findTopByConnectionIdOrderByBillingYearDescBillingMonthDesc(
                        request.getConnectionId()
                );

        if (lastBillOpt.isPresent()) {
            Bill lastBill = lastBillOpt.get();

            // ❌ unpaid bill exists → STOP
            if (lastBill.getStatus() != BillStatus.PAID) {
                throw new ApiException(
                        "Unpaid bill already exists for this connection",
                        HttpStatus.BAD_REQUEST
                );
            }
        }

        // ✅ 2. Call meter service ONLY NOW
        var reading = meterClient.getLatest(request.getConnectionId());

        if (reading == null) {
            throw new ApiException(
                "Meter reading not available for next billing period",
                HttpStatus.BAD_REQUEST
            );
        }
        int billingMonth = reading.getReadingMonth();
        int billingYear = reading.getReadingYear();

        // ✅ 3. Ensure reading is for NEW period
        if (lastBillOpt.isPresent()) {
            Bill lastBill = lastBillOpt.get();

            if (
                billingYear < lastBill.getBillingYear() ||
                (billingYear == lastBill.getBillingYear()
                 && billingMonth <= lastBill.getBillingMonth())
            ) {
                throw new ApiException(
                        "Meter reading for next billing period not available yet",
                        HttpStatus.BAD_REQUEST
                );
            }
        }


        // 2️⃣ Prevent duplicate unpaid bill for same month
        billRepository
                .findByConnectionIdAndBillingMonthAndBillingYearAndStatusNot(
                        request.getConnectionId(),
                        billingMonth,
                        billingYear,
                        BillStatus.PAID
                )
                .ifPresent(b -> {
                    throw new ApiException(
                            "Unpaid bill already exists for this billing period",
                            HttpStatus.BAD_REQUEST
                    );
                });

        long units = reading.getConsumptionUnits();
        if (units <= 0) {
            throw new ApiException("Invalid consumption units", HttpStatus.BAD_REQUEST);
        }

        // 3️⃣ Fetch tariff slabs (DB driven)
        String tariffPlan = "DOMESTIC"; // later from Consumer Service
        List<TariffSlab> slabs =
                slabRepository.findByUtilityTypeAndPlanCodeOrderByMinUnitsAsc(
                        reading.getUtilityType(),  
                        tariffPlan
                );

        if (slabs.isEmpty()) {
            throw new ApiException(
                    "Tariff slabs not configured",
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        // 4️⃣ Calculate charges
        double energyCharge = calculateFromSlabs(units, slabs);
        double fixedCharge = 50;
        double tax = energyCharge * 0.05;

        Bill bill = new Bill();
        bill.setConsumerId(request.getConsumerId());
        bill.setConnectionId(request.getConnectionId());
        bill.setBillingMonth(billingMonth);
        bill.setBillingYear(billingYear);
        bill.setUtilityType(reading.getUtilityType()); 
        bill.setTariffPlan(tariffPlan);               

        bill.setConsumptionUnits(units);
        bill.setEnergyCharge(energyCharge);
        bill.setFixedCharge(fixedCharge);
        bill.setTax(tax);
        bill.setPenalty(0);
        bill.setTotalAmount(energyCharge + fixedCharge + tax);

        bill.setStatus(BillStatus.DUE);
        bill.setBillDate(LocalDate.now());
        bill.setDueDate(LocalDate.now().plusDays(15));

        billRepository.save(bill);
        return map(bill);
    }

    // 🔹 slab calculation
    private double calculateFromSlabs(long units, List<TariffSlab> slabs) {

        double amount = 0;
        long remaining = units;

        for (TariffSlab slab : slabs) {
            if (remaining <= 0) break;

            long slabUnits = Math.min(
                    remaining,
                    slab.getMaxUnits() - slab.getMinUnits() + 1
            );

            amount += slabUnits * slab.getRate();
            remaining -= slabUnits;
        }
        return amount;
    }

    // ---------------- OVERDUE LOGIC ----------------
    public List<BillResponse> getOverdueBills() {

        return billRepository.findByStatus(BillStatus.OVERDUE)
                .stream()
                .map(this::map)
                .toList();
    }

    // ---------------- PAYMENT ----------------
    public void markBillAsPaid(String billId) {

        Bill bill = billRepository.findById(billId)
                .orElseThrow(() ->
                        new ApiException("Bill not found", HttpStatus.NOT_FOUND)
                );

        if (bill.getStatus() == BillStatus.PAID) {
            throw new ApiException("Bill already paid", HttpStatus.BAD_REQUEST);
        }

        // ✅ Freeze bill state
        bill.setStatus(BillStatus.PAID);

        // ✅ Finalize total (includes penalty if any)
        bill.setTotalAmount(
                bill.getEnergyCharge()
                + bill.getFixedCharge()
                + bill.getTax()
                + bill.getPenalty()
        );

        billRepository.save(bill);
    }

    public BillResponse getBillById(String billId) {
        return billRepository.findById(billId)
                .map(this::map)
                .orElseThrow(() ->
                        new ApiException("Bill not found", HttpStatus.NOT_FOUND)
                );
    }

    public List<BillResponse> getBillsByConsumer(String consumerId) {

        var bills = billRepository.findByConsumerId(consumerId);
        if (bills.isEmpty()) {
            throw new ApiException(
                    "No bills found for consumer",
                    HttpStatus.NOT_FOUND
            );
        }
        return bills.stream().map(this::map).toList();
    }

    public BillResponse meterFallback(
            GenerateBillRequest request,
            Throwable ex
    ) {
        throw new ApiException(
                "Meter service unavailable",
                HttpStatus.SERVICE_UNAVAILABLE
        );
    }

    private BillResponse map(Bill bill) {

        BillResponse r = new BillResponse();
        r.setId(bill.getId());
        r.setConsumerId(bill.getConsumerId());
        r.setConnectionId(bill.getConnectionId());

        r.setUtilityType(bill.getUtilityType());     
        r.setTariffPlan(bill.getTariffPlan());       
        r.setBillingMonth(bill.getBillingMonth());   
        r.setBillingYear(bill.getBillingYear());    
        r.setPenalty(bill.getPenalty());              // ✅
        r.setPayableAmount(                           // ✅ calculated view
                bill.getTotalAmount() + bill.getPenalty()
        );

        r.setConsumptionUnits(bill.getConsumptionUnits());
        r.setTotalAmount(bill.getTotalAmount());
        r.setStatus(bill.getStatus());
        r.setDueDate(bill.getDueDate());

        return r;
    }
}