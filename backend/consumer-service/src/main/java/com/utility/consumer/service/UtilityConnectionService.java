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

    public List<ConnectionResponseDto> getConnectionsByUserId(String userId) {

        Consumer consumer = consumerRepository.findById(userId)
                .orElseThrow(() ->
                        new ApiException(HttpStatus.NOT_FOUND, "Consumer not found"));

        return connectionRepository
                .findByConsumerId(consumer.getId())
                .stream()
                .map(this::mapToDto)
                .toList();
    }
    private ConnectionResponseDto mapToDto(UtilityConnection connection) {

        ConnectionResponseDto dto = new ConnectionResponseDto();
        dto.setId(connection.getId());
        dto.setUtilityType(connection.getUtilityType());
        dto.setMeterNumber(connection.getMeterNumber());
        dto.setTariffPlan(connection.getTariffPlanCode());
        dto.setActive(connection.isActive());
        dto.setActivatedAt(connection.getActivatedAt());

        return dto;
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

        return mapToDto(connection);    }
}