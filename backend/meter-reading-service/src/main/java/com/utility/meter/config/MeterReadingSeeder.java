package com.utility.meter.config;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.utility.meter.dto.ConnectionDto;
import com.utility.meter.feign.ConsumerConnectionClient;
import com.utility.meter.model.MeterReading;
import com.utility.meter.model.UtilityType;
import com.utility.meter.repository.MeterReadingRepository;

import feign.FeignException;
import lombok.RequiredArgsConstructor;

@Component
@EnableScheduling
@RequiredArgsConstructor
public class MeterReadingSeeder {

    private final MeterReadingRepository meterRepo;
    private final ConsumerConnectionClient connectionClient;

    private final Random random = new Random();
    private boolean seeded = false;

    @Scheduled(initialDelay = 20000, fixedDelay = 30000)
    public void seedMeterReadingsSafely() {

        if (seeded || meterRepo.count() > 0) {
            return;
        }

        try {
            List<ConnectionDto> connections =
                    connectionClient.getAllConnections();

            LocalDate start = LocalDate.of(2024, 6, 1);
            LocalDate end = LocalDate.now().withDayOfMonth(1);

            for (ConnectionDto conn : connections) {

                long previousReading = 0;
                LocalDate cursor = start;

                while (!cursor.isAfter(end)) {

                    previousReading =
                            saveReading(
                                    conn,
                                    cursor.getYear(),
                                    cursor.getMonthValue(),
                                    previousReading
                            );

                    cursor = cursor.plusMonths(1);
                }
            }

            seeded = true;

        } catch (FeignException ignored) {
        }
    }

    private long saveReading(
            ConnectionDto conn,
            int year,
            int month,
            long previousReading
    ) {

        long consumption = generateConsumption(conn.getUtilityType());
        long currentReading = previousReading + consumption;

        MeterReading reading = new MeterReading();

        reading.setConsumerId(conn.getConsumerId());
        reading.setConnectionId(conn.getId());
        reading.setUtilityType(conn.getUtilityType());
        reading.setMeterNumber(conn.getMeterNumber());

        reading.setPreviousReading(previousReading);
        reading.setCurrentReading(currentReading);
        reading.setConsumptionUnits(consumption);

        reading.setReadingMonth(month);
        reading.setReadingYear(year);
        reading.setReadingDate(
                LocalDate.of(year, month, 25)
        );
        reading.setCreatedAt(LocalDateTime.now());

        meterRepo.save(reading);

        return currentReading;
    }

    private long generateConsumption(UtilityType type) {

        return switch (type) {
            case ELECTRICITY -> 100 + random.nextInt(300);
            case WATER -> 10 + random.nextInt(40);
            case GAS -> 5 + random.nextInt(25);
            case INTERNET -> 1;
        };
    }
}