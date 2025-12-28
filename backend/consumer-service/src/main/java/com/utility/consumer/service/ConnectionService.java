package com.utility.consumer.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.utility.consumer.model.UtilityConnection;
import com.utility.consumer.repository.ConnectionRepository;

import jakarta.ws.rs.BadRequestException;

@Service
public class ConnectionService {

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private ConsumerRepository consumerRepository;

    public ConnectionResponseDTO addConnection(ConnectionRequestDTO dto) {

        if (!consumerRepository.existsById(dto.getConsumerId())) {
            throw new ResourceNotFoundException("Consumer does not exist");
        }

        if (connectionRepository.existsByMeterNumber(dto.getMeterNumber())) {
            throw new DuplicateResourceException("Meter already assigned");
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