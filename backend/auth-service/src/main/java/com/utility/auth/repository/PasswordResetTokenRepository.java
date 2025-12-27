package com.utility.auth.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.utility.auth.model.PasswordResetToken;

public interface PasswordResetTokenRepository
        extends MongoRepository<PasswordResetToken, String> {

    Optional<PasswordResetToken> findByToken(String token);
}