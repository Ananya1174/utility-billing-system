package com.utility.consumer.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.utility.consumer.dto.request.ConsumerRequestDTO;
import com.utility.consumer.dto.response.ConsumerResponseDTO;
import com.utility.consumer.model.Consumer;
import com.utility.consumer.repository.ConsumerRepository;

import jakarta.ws.rs.BadRequestException;

@Service
public class ConsumerService {

    @Autowired
    private ConsumerRepository consumerRepository;

    public ConsumerResponseDTO createConsumer(ConsumerRequestDTO dto) {

        if (consumerRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }
        if (consumerRepository.existsByMobileNumber(dto.getMobileNumber())) {
            throw new DuplicateResourceException("Mobile number already exists");
        }

        Consumer consumer = new Consumer();
        consumer.setFullName(dto.getFullName());
        consumer.setEmail(dto.getEmail());
        consumer.setMobileNumber(dto.getMobileNumber());
        consumer.setAddress(dto.getAddress());
        consumer.setCreatedAt(LocalDateTime.now());

        return mapToDTO(consumerRepository.save(consumer));
    }

    public ConsumerResponseDTO getConsumer(String id) {
        Consumer consumer = consumerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consumer not found"));
        return mapToDTO(consumer);
    }

    public List<ConsumerResponseDTO> getAllConsumers() {
        return consumerRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public ConsumerResponseDTO updateConsumer(String id, ConsumerRequestDTO dto) {
        Consumer consumer = consumerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consumer not found"));

        consumer.setFullName(dto.getFullName());
        consumer.setAddress(dto.getAddress());
        consumer.setUpdatedAt(LocalDateTime.now());

        return mapToDTO(consumerRepository.save(consumer));
    }

    public void deactivateConsumer(String id) {
        Consumer consumer = consumerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consumer not found"));

        consumer.setActive(false);
        consumer.setUpdatedAt(LocalDateTime.now());
        consumerRepository.save(consumer);
    }

    private ConsumerResponseDTO mapToDTO(Consumer c) {
        return new ConsumerResponseDTO(
                c.getId(),
                c.getFullName(),
                c.getEmail(),
                c.getMobileNumber(),
                c.getAddress(),
                c.isActive()
        );
    }
}