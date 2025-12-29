package com.utility.payment.repository;

import com.utility.payment.model.Payment;
import com.utility.payment.model.PaymentStatus;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PaymentRepository extends MongoRepository<Payment, String> {
	boolean existsByBillIdAndStatus(String billId, PaymentStatus status);

    List<Payment> findByBillId(String billId);
}