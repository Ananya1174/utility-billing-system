package com.utility.consumer.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.utility.consumer.dto.request.ConnectionRequestDTO;
import com.utility.consumer.dto.response.ConnectionResponseDTO;
import com.utility.consumer.service.ConnectionService;

@RestController
@RequestMapping("/connections")
public class ConnectionController {

    @Autowired
    private ConnectionService connectionService;

    @PostMapping
    public ResponseEntity<ConnectionResponseDTO> add(
            @Valid @RequestBody ConnectionRequestDTO dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(connectionService.addConnection(dto));
    }

    @GetMapping("/consumer/{consumerId}")
    public ResponseEntity<List<ConnectionResponseDTO>> getByConsumer(
            @PathVariable String consumerId) {

        return ResponseEntity.ok(
                connectionService.getConnectionsByConsumer(consumerId));
    }
}
