package com.utility.meter.service;

import com.utility.meter.dto.CreateMeterReadingRequest;
import com.utility.meter.dto.MeterReadingResponse;

import java.util.List;

public interface MeterReadingService {

    MeterReadingResponse addReading(CreateMeterReadingRequest request);

    List<MeterReadingResponse> getByConsumer(String consumerId);

    List<MeterReadingResponse> getByMonth(String month);

    MeterReadingResponse getLatest(String connectionId);
}