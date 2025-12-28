package com.utility.consumer.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.utility.consumer.model.UtilityConnection;

public interface ConnectionRepository extends MongoRepository<UtilityConnection, String> {
    boolean existsByMeterNumber(String meterNumber);
    List<UtilityConnection> findByConsumerId(String consumerId);
}
