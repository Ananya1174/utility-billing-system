package com.utility.billing.repository;

import com.utility.billing.model.Bill;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BillRepository extends MongoRepository<Bill, String> {

    List<Bill> findByConsumerId(String consumerId);
}