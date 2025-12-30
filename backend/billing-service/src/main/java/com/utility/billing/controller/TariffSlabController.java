package com.utility.billing.controller;

import com.utility.billing.model.TariffSlab;
import com.utility.billing.repository.TariffSlabRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tariffs/slabs")
@RequiredArgsConstructor
public class TariffSlabController {

    private final TariffSlabRepository repository;

    // ➕ Add slab
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TariffSlab create(@RequestBody TariffSlab slab) {
        return repository.save(slab);
    }
}