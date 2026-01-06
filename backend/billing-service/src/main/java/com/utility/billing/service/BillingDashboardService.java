package com.utility.billing.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.utility.billing.dto.BillResponse;
import com.utility.billing.dto.dashboard.AverageConsumptionDto;
import com.utility.billing.dto.dashboard.BillsSummaryDto;
import com.utility.billing.dto.dashboard.ConsumerBillingSummaryDto;
import com.utility.billing.dto.dashboard.ConsumptionSummaryDto;
import com.utility.billing.dto.dashboard.DashboardConsumptionResponse;
import com.utility.billing.dto.dashboard.MonthlyConsumptionDto;
import com.utility.billing.dto.dashboard.UtilityConsumptionDto;
import com.utility.billing.model.Bill;
import com.utility.billing.model.BillStatus;
import com.utility.billing.model.UtilityType;
import com.utility.billing.repository.BillRepository;
import com.utility.billing.dto.dashboard.UtilityCostDistributionDto;
import com.utility.billing.model.Bill;
import com.utility.billing.model.UtilityType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BillingDashboardService {

	private final BillRepository billRepository;
	private final BillingService billingService;

	public BillsSummaryDto getBillsSummary(int month, int year) {

		long total = billRepository.countByBillingMonthAndBillingYear(month, year);

		long paid = billRepository.countByBillingMonthAndBillingYearAndStatus(month, year, BillStatus.PAID);

		return new BillsSummaryDto(month, year, total, paid, total - paid);
	}

	public List<ConsumptionSummaryDto> getConsumptionSummary(int month, int year) {

		return billRepository.findByBillingMonthAndBillingYear(month, year).stream()
				.collect(Collectors.groupingBy(Bill::getUtilityType, Collectors.summingLong(Bill::getConsumptionUnits)))
				.entrySet().stream().map(e -> new ConsumptionSummaryDto(e.getKey(), e.getValue())).toList();
	}

	public List<AverageConsumptionDto> getAverageConsumption(int month, int year) {

		return billRepository.findByBillingMonthAndBillingYear(month, year).stream()
				.collect(Collectors.groupingBy(Bill::getUtilityType,
						Collectors.averagingLong(Bill::getConsumptionUnits)))
				.entrySet().stream().map(e -> new AverageConsumptionDto(e.getKey(), e.getValue())).toList();
	}

	public List<UtilityCostDistributionDto> getUtilityCostDistribution(String consumerId, int year) {
		List<Bill> bills = billRepository.findByConsumerIdAndBillingYear(consumerId, year);

		if (bills.isEmpty()) {
			return Collections.emptyList();
		}

		Map<UtilityType, Double> costMap = new HashMap<>();
		double totalCost = 0;

		for (Bill bill : bills) {
			double amount = bill.getTotalAmount();
			costMap.merge(bill.getUtilityType(), amount, Double::sum);
			totalCost += amount;
		}

		final double finalTotalCost = totalCost;
		List<UtilityCostDistributionDto> result = new ArrayList<>();

		for (Map.Entry<UtilityType, Double> entry : costMap.entrySet()) {
			double percentage = Math.round((entry.getValue() / finalTotalCost) * 100);

			result.add(new UtilityCostDistributionDto(entry.getKey(), percentage));
		}

		return result;
	}

	public List<ConsumerBillingSummaryDto> getConsumerBillingSummary(int month, int year) {

		return billRepository.findByBillingMonthAndBillingYear(month, year).stream()
				.collect(Collectors.groupingBy(Bill::getConsumerId)).entrySet().stream()
				.map(e -> buildConsumerSummary(e.getKey(), e.getValue())).toList();
	}

	public List<BillResponse> getConsumerBillingHistory(String consumerId) {
		return billingService.getBillsByConsumer(consumerId);
	}

	public double getTotalBilledForMonth(int month, int year) {

		return billRepository.findByBillingMonthAndBillingYear(month, year).stream().mapToDouble(Bill::getTotalAmount)
				.sum();
	}

	public DashboardConsumptionResponse getConsumptionData(String consumerId, int year, Integer month,
			UtilityType utilityType) {

		List<Bill> bills = billRepository.findByConsumerId(consumerId);

		Map<UtilityType, Long> utilityMap = bills.stream().filter(b -> b.getBillingYear() == year)
				.filter(b -> month == null || b.getBillingMonth() == month).collect(
						Collectors.groupingBy(Bill::getUtilityType, Collectors.summingLong(Bill::getConsumptionUnits)));

		List<UtilityConsumptionDto> byUtility = utilityMap.entrySet().stream()
				.map(e -> new UtilityConsumptionDto(e.getKey(), e.getValue())).toList();

		Map<Integer, Long> monthMap = bills.stream().filter(b -> b.getBillingYear() == year)
				.filter(b -> utilityType == null || b.getUtilityType() == utilityType).collect(Collectors
						.groupingBy(Bill::getBillingMonth, Collectors.summingLong(Bill::getConsumptionUnits)));

		List<MonthlyConsumptionDto> monthly = monthMap.entrySet().stream().sorted(Map.Entry.comparingByKey())
				.map(e -> new MonthlyConsumptionDto(e.getKey(), e.getValue())).toList();

		return new DashboardConsumptionResponse(byUtility, monthly);
	}

	private ConsumerBillingSummaryDto buildConsumerSummary(String consumerId, List<Bill> bills) {

		double total = bills.stream().mapToDouble(Bill::getTotalAmount).sum();

		double paid = bills.stream().filter(b -> b.getStatus() == BillStatus.PAID).mapToDouble(Bill::getTotalAmount)
				.sum();

		return new ConsumerBillingSummaryDto(consumerId, bills.size(), total, paid, total - paid);
	}
}