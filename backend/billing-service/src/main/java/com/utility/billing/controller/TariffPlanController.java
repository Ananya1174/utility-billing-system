package com.utility.billing.controller;

import com.utility.billing.model.TariffPlan;
import com.utility.billing.model.UtilityType;
import com.utility.billing.repository.TariffPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tariffs/plans")
@RequiredArgsConstructor
public class TariffPlanController {

    private final TariffPlanRepository repository;

    // ---------------- CREATE PLAN (ADMIN) ----------------
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TariffPlan create(@RequestBody TariffPlan plan) {

        if (repository.existsByUtilityTypeAndPlanCode(
                plan.getUtilityType(),
                plan.getPlanCode())) {
            throw new RuntimeException("Tariff plan already exists");
        }

        plan.setActive(true);
        return repository.save(plan);
    }

    // ---------------- DEACTIVATE PLAN (ADMIN) ----------------
    @PutMapping("/{id}/deactivate")
    public Map<String, String> deactivate(@PathVariable String id) {

        TariffPlan plan = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tariff plan not found"));

        if (!plan.isActive()) {
            return Map.of("message", "Tariff plan already inactive");
        }

        plan.setActive(false);
        repository.save(plan);

        return Map.of(
            "message",
            "Tariff plan " + plan.getPlanCode() + " deactivated successfully"
        );
    }

    // ---------------- GET ALL ACTIVE PLANS ----------------
    @GetMapping("/active")
    public List<TariffPlan> activePlans() {
        return repository.findByActiveTrue();
    }

    // ✅ ---------------- NEW API (FRONTEND USE) ----------------
    // GET /tariffs/plans?utilityType=ELECTRICITY
    @GetMapping
    public List<TariffPlan> getPlansByUtility(
            @RequestParam UtilityType utilityType) {

        return repository.findByUtilityTypeAndActiveTrue(utilityType);
    }
}