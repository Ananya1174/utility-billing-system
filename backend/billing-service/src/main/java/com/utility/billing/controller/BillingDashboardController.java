package com.utility.billing.controller;

import com.utility.billing.dto.BillResponse;
import com.utility.billing.dto.dashboard.AverageConsumptionDto;
import com.utility.billing.dto.dashboard.BillsSummaryDto;
import com.utility.billing.dto.dashboard.ConsumerBillingSummaryDto;
import com.utility.billing.dto.dashboard.ConsumptionSummaryDto;
import com.utility.billing.service.BillingDashboardService;
import com.utility.billing.service.BillingService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard/billing")
@RequiredArgsConstructor
public class BillingDashboardController {

	private final BillingDashboardService dashboardService;
	private final BillingService billingService;

	@GetMapping("/bills-summary")
	public BillsSummaryDto billsSummary(@RequestParam int month, @RequestParam int year) {

		return dashboardService.getBillsSummary(month, year);
	}

	@GetMapping("/consumption-summary")
	public List<ConsumptionSummaryDto> consumptionSummary(@RequestParam int month, @RequestParam int year) {

		return dashboardService.getConsumptionSummary(month, year);
	}

	@GetMapping("/consumption-average")
	public List<AverageConsumptionDto> averageConsumption(@RequestParam int month, @RequestParam int year) {

		return dashboardService.getAverageConsumption(month, year);
	}

	@GetMapping("/consumer-summary")
	public List<ConsumerBillingSummaryDto> consumerBillingSummary(@RequestParam int month, @RequestParam int year) {

		return dashboardService.getConsumerBillingSummary(month, year);
	}

	@GetMapping("/consumer/{consumerId}")
	public List<BillResponse> consumerBillingHistory(@PathVariable String consumerId) {

		return dashboardService.getConsumerBillingHistory(consumerId);
	}

	@GetMapping("/consumption/utility")
	public List<ConsumptionSummaryDto> consumptionReport(@RequestParam int month, @RequestParam int year) {

		return dashboardService.getConsumptionSummary(month, year);
	}
	@GetMapping("/total-billed")
	public double getTotalBilled() {
	    return billingService.getTotalBilledAmount();
	}
}