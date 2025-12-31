package com.utility.consumer.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.utility.consumer.dto.response.ConnectionResponseDto;
import com.utility.consumer.exception.ApiException;
import com.utility.consumer.model.Consumer;
import com.utility.consumer.model.UtilityConnection;
import com.utility.consumer.repository.ConnectionRepository;
import com.utility.consumer.repository.ConsumerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UtilityConnectionService {

    private final ConnectionRepository connectionRepository;
    private final ConsumerRepository consumerRepository;

    public List<ConnectionResponseDto> getConnectionsByUsername(String username) {

        Consumer consumer = consumerRepository.findByEmail(username)
                .orElseThrow(() ->
                        new ApiException(HttpStatus.NOT_FOUND, "Consumer not found")
                );

        return connectionRepository.findByConsumerId(consumer.getId())
                .stream()
                .map(this::map)
                .toList();
    }

    private ConnectionResponseDto map(UtilityConnection c) {
        return new ConnectionResponseDto(
                c.getId(),
                c.getUtilityType(),
                c.getMeterNumber(),
                c.getTariffPlanCode(),
                c.isActive()
        );
    }
    public ConnectionResponseDto getConnectionById(String connectionId) {

        UtilityConnection connection =
                connectionRepository.findById(connectionId)
                        .orElseThrow(() ->
                                new ApiException(
                                        HttpStatus.NOT_FOUND,
                                        "Connection not found"
                                )
                        );

        if (!connection.isActive()) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Connection is inactive"
            );
        }

        return map(connection);
    }
}