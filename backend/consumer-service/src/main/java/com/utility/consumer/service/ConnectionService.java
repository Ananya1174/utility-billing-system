package com.utility.consumer.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.utility.consumer.dto.request.ConnectionRequestDTO;
import com.utility.consumer.dto.response.ConnectionResponseDTO;
import org.springframework.http.HttpStatus;

import com.utility.consumer.exception.ApiException;

import com.utility.consumer.model.UtilityConnection;
import com.utility.consumer.repository.ConnectionRepository;
import com.utility.consumer.repository.ConsumerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final ConsumerRepository consumerRepository;

    public ConnectionResponseDTO addConnection(ConnectionRequestDTO dto) {

        if (!consumerRepository.existsById(dto.getConsumerId())) {
        	throw new ApiException(HttpStatus.NOT_FOUND, "Consumer does not exist");

        }

        if (connectionRepository.existsByMeterNumber(dto.getMeterNumber())) {
        	throw new ApiException(HttpStatus.CONFLICT, "Meter already assigned");
        }

        UtilityConnection connection = new UtilityConnection();
        connection.setConsumerId(dto.getConsumerId());
        connection.setUtilityType(dto.getUtilityType());
        connection.setMeterNumber(dto.getMeterNumber());
        connection.setTariffPlan(dto.getTariffPlan());
        connection.setCreatedAt(LocalDateTime.now());

        UtilityConnection saved = connectionRepository.save(connection);

        return new ConnectionResponseDTO(
                saved.getId(),
                saved.getUtilityType(),
                saved.getMeterNumber(),
                saved.getTariffPlan(),
                saved.isActive()
        );
    }

    public List<ConnectionResponseDTO> getConnectionsByConsumer(String consumerId) {
        return connectionRepository.findByConsumerId(consumerId)
                .stream()
                .map(c -> new ConnectionResponseDTO(
                        c.getId(),
                        c.getUtilityType(),
                        c.getMeterNumber(),
                        c.getTariffPlan(),
                        c.isActive()
                ))
                .toList();
    }
}
