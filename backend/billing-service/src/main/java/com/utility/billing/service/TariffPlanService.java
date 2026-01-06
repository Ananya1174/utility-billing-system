package com.utility.billing.service;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.utility.billing.dto.TariffPlanDto;
import com.utility.billing.dto.TariffPlanResponse;
import com.utility.billing.exception.ApiException;
import com.utility.billing.model.TariffPlan;
import com.utility.billing.repository.TariffPlanRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TariffPlanService {

    private final TariffPlanRepository repository;

    /* ================= CREATE ================= */

    public TariffPlanResponse createTariffPlan(TariffPlanDto dto) {

        TariffPlan plan = toEntity(dto);

        boolean exists =
                repository.existsByUtilityTypeAndPlanCode(
                        plan.getUtilityType(),
                        plan.getPlanCode()
                );

        if (exists) {
            throw new ApiException(
                    "Tariff plan already exists",
                    HttpStatus.CONFLICT
            );
        }

        plan.setActive(true);
        TariffPlan saved = repository.save(plan);

        return TariffPlanResponse.from(saved);
    }

    /* ================= DEACTIVATE ================= */

    public Map<String, String> deactivateTariffPlan(String id) {

        TariffPlan plan =
                repository.findById(id)
                        .orElseThrow(() ->
                                new ApiException(
                                        "Tariff plan not found",
                                        HttpStatus.NOT_FOUND
                                )
                        );

        if (!plan.isActive()) {
            return Map.of(
                    "message",
                    "Tariff plan already inactive"
            );
        }

        plan.setActive(false);
        repository.save(plan);

        return Map.of(
                "message",
                "Tariff plan " + plan.getPlanCode() + " deactivated successfully"
        );
    }

    /* ================= GET ACTIVE (FIXED) ================= */

    public List<TariffPlanResponse> getActivePlans() {

        return repository.findByActiveTrue()
                .stream()
                .map(TariffPlanResponse::from)
                .toList();
    }

    /* ================= GET ALL / FILTERED (FIXED) ================= */

    public List<TariffPlanResponse> getPlans(Boolean active) {

        List<TariffPlan> plans;

        if (active == null) {
            plans = repository.findAll();
        } else if (active) {
            plans = repository.findByActiveTrue();
        } else {
            plans = repository.findAll()
                    .stream()
                    .filter(plan -> !plan.isActive())
                    .toList();
        }

        return plans.stream()
                .map(TariffPlanResponse::from)
                .toList();
    }

    /* ================= PRIVATE MAPPERS ================= */

    private TariffPlan toEntity(TariffPlanDto dto) {

        TariffPlan plan = new TariffPlan();
        plan.setUtilityType(dto.getUtilityType());
        plan.setPlanCode(dto.getPlanCode());
        return plan;
    }

    
}