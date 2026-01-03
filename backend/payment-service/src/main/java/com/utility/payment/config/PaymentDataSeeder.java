package com.utility.payment.config;

import com.utility.payment.feign.BillingClient;
import com.utility.payment.model.*;
import com.utility.payment.repository.InvoiceRepository;
import com.utility.payment.repository.PaymentRepository;
import com.utility.payment.dto.BillResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Configuration
@RequiredArgsConstructor
public class PaymentDataSeeder {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final BillingClient billingClient;

    @Bean
    CommandLineRunner seedPayments() {
        return args -> {

            if (paymentRepository.count() > 0) {
                System.out.println("Payments already exist. Skipping seeding.");
                return;
            }

            System.out.println("🌱 Seeding Payments & Invoices...");

            // ⚠️ Get PAID bills only (since payments must exist only for PAID bills)
            List<BillResponse> paidBills =
            		billingClient.getAllBills(
            		        BillStatus.PAID,
            		        null,
            		        null,
            		        null
            		    )
                            .stream()
                            .filter(b -> b.getStatus() == BillStatus.PAID)
                            .toList();

            Random random = new Random();

            for (BillResponse bill : paidBills) {

                boolean success = random.nextBoolean(); // SUCCESS / FAILED
                PaymentMode mode =
                        random.nextBoolean()
                                ? PaymentMode.ONLINE
                                : PaymentMode.OFFLINE;

                Payment payment = new Payment();
                payment.setBillId(bill.getId());
                payment.setConsumerId(bill.getConsumerId());
                payment.setAmount(bill.getPayableAmount());
                payment.setMode(mode);
                payment.setStatus(success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
                payment.setTransactionId(UUID.randomUUID().toString());
                payment.setBillingMonth(bill.getBillingMonth());
                payment.setBillingYear(bill.getBillingYear());
                payment.setCreatedAt(LocalDateTime.now());
                payment.setConfirmedAt(success ? LocalDateTime.now() : null);

                paymentRepository.save(payment);

                // ✅ Invoice ONLY if payment SUCCESS
                if (success) {
                    Invoice invoice = new Invoice();
                    invoice.setInvoiceNumber("INV-" + System.currentTimeMillis());
                    invoice.setBillId(bill.getId());
                    invoice.setPaymentId(payment.getId());
                    invoice.setConsumerId(bill.getConsumerId());
                    invoice.setBillingMonth(bill.getBillingMonth());
                    invoice.setBillingYear(bill.getBillingYear());
                    invoice.setEnergyCharge(bill.getEnergyCharge());
                    invoice.setTax(bill.getTax());
                    invoice.setPenalty(bill.getPenalty());
                    invoice.setAmountPaid(payment.getAmount());
                    invoice.setTotalAmount(payment.getAmount());
                    invoice.setInvoiceDate(LocalDateTime.now());

                    invoiceRepository.save(invoice);
                }
            }

            System.out.println("✅ Payment & Invoice seeding completed");
        };
    }
}