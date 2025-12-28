package com.utility.meter.service;

import com.utility.meter.dto.CreateMeterReadingRequest;
import com.utility.meter.dto.MeterReadingResponse;
import com.utility.meter.exception.ApiException;
import org.springframework.http.HttpStatus;
import com.utility.meter.model.MeterReading;
import com.utility.meter.repository.MeterReadingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MeterReadingServiceImpl implements MeterReadingService {

    private final MeterReadingRepository repository;

    @Override
    public MeterReadingResponse addReading(CreateMeterReadingRequest request) {

        long previous = repository
                .findTopByConnectionIdOrderByCreatedAtDesc(request.getConnectionId())
                .map(MeterReading::getCurrentReading)
                .orElse(0L);

        if (request.getCurrentReading() < previous) {
        	throw new ApiException("Current reading cannot be less than previous reading", HttpStatus.BAD_REQUEST);
        }

        MeterReading reading = new MeterReading();
        reading.setConsumerId(request.getConsumerId());
        reading.setConnectionId(request.getConnectionId());
        reading.setUtilityType(request.getUtilityType());
        reading.setMeterNumber(request.getMeterNumber());
        reading.setPreviousReading(previous);
        reading.setCurrentReading(request.getCurrentReading());
        reading.setConsumptionUnits(request.getCurrentReading() - previous);
        reading.setReadingMonth(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM")));
        reading.setReadingDate(LocalDate.now());
        reading.setCreatedAt(LocalDateTime.now());

        repository.save(reading);

        return map(reading);
    }

    @Override
    public List<MeterReadingResponse> getByConsumer(String consumerId) {
        return repository.findByConsumerId(consumerId).stream().map(this::map).toList();
    }

    @Override
    public List<MeterReadingResponse> getByMonth(String month) {
        return repository.findByReadingMonth(month).stream().map(this::map).toList();
    }

    @Override
    public MeterReadingResponse getLatest(String connectionId) {

        MeterReading reading = repository
                .findTopByConnectionIdOrderByCreatedAtDesc(connectionId)
                .orElseThrow(() ->
                        new ApiException("No meter reading found for connection " + connectionId,
                                HttpStatus.NOT_FOUND)
                );

        return map(reading);
    }

    private MeterReadingResponse map(MeterReading reading) {
        MeterReadingResponse r = new MeterReadingResponse();
        r.setId(reading.getId());
        r.setConsumerId(reading.getConsumerId());
        r.setConnectionId(reading.getConnectionId());
        r.setUtilityType(reading.getUtilityType());
        r.setMeterNumber(reading.getMeterNumber());
        r.setPreviousReading(reading.getPreviousReading());
        r.setCurrentReading(reading.getCurrentReading());
        r.setConsumptionUnits(reading.getConsumptionUnits());
        r.setReadingMonth(reading.getReadingMonth());
        return r;
    }
}