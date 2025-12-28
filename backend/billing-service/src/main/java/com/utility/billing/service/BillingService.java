package com.utility.billing.service;

import com.utility.billing.dto.BillResponse;
import com.utility.billing.dto.GenerateBillRequest;

import java.util.List;

public interface BillingService {

    BillResponse generateBill(GenerateBillRequest request);

    List<BillResponse> getBillsByConsumer(String consumerId);
}