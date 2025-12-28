package com.utility.meter.repository;

import com.utility.meter.model.MeterReading;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface MeterReadingRepository extends MongoRepository<MeterReading, String> {

    Optional<MeterReading> findTopByConnectionIdOrderByCreatedAtDesc(String connectionId);

    List<MeterReading> findByConsumerId(String consumerId);

    List<MeterReading> findByReadingMonth(String readingMonth);
}