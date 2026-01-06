package com.utility.billing.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.utility.billing.dto.TariffPlanDto;
import com.utility.billing.dto.TariffPlanResponse;
import com.utility.billing.service.TariffPlanService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/tariffs/plans")
@RequiredArgsConstructor
public class TariffPlanController {

    private final TariffPlanService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TariffPlanResponse create(@RequestBody TariffPlanDto dto) {
        return service.createTariffPlan(dto);
    }

    @PutMapping("/{id}/deactivate")
    public Map<String, String> deactivate(@PathVariable("id") String id) {
        return service.deactivateTariffPlan(id);
    }
    @GetMapping("/plans/active")
    public List<TariffPlanResponse> getActivePlans() {
        return service.getActivePlans();
    }

    @GetMapping("/plans")
    public List<TariffPlanResponse> getPlans(
            @RequestParam(required = false) Boolean active) {
        return service.getPlans(active);
    }
}