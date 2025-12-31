package com.utility.consumer.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.utility.consumer.dto.response.ConnectionResponseDto;
import com.utility.consumer.service.UtilityConnectionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/connections")
@RequiredArgsConstructor
public class UtilityConnectionController {

    private final UtilityConnectionService connectionService;

    // ---------------- CONSUMER DASHBOARD ----------------
    @GetMapping
    @PreAuthorize("hasRole('CONSUMER')")
    public List<ConnectionResponseDto> getMyConnections(Principal principal) {

        String username = principal.getName();
        return connectionService.getConnectionsByUsername(username);
    }

    // ---------------- BILLING SERVICE ----------------
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('BILLING')")
    public ConnectionResponseDto getConnectionById(
            @PathVariable String id) {

        return connectionService.getConnectionById(id);
    }
}