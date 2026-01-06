package com.utility.billing.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.utility.billing.dto.TariffSlabDto;
import com.utility.billing.dto.TariffSlabResponse;
import com.utility.billing.model.UtilityType;
import com.utility.billing.service.TariffSlabService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/tariffs/slabs")
@RequiredArgsConstructor
public class TariffSlabController {

    private final TariffSlabService slabService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TariffSlabDto create(@RequestBody TariffSlabDto dto) {
        return slabService.createSlab(dto);
    }

    @DeleteMapping("/{id}")
    public TariffSlabDto delete(@PathVariable("id") String id) {
        return slabService.deleteSlab(id);
    }
    @GetMapping
    public List<TariffSlabResponse> getSlabs(
            @RequestParam UtilityType utilityType,
            @RequestParam String planCode
    ) {
        return slabService.getSlabs(utilityType, planCode);
    }
}