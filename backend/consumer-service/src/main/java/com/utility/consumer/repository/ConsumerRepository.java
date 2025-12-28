package com.utility.consumer.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.utility.consumer.model.Consumer;

public interface ConsumerRepository extends MongoRepository<Consumer, String> {
    boolean existsByEmail(String email);
    boolean existsByMobileNumber(String mobileNumber);
}
