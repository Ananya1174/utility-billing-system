package com.utility.billing.feign;

import com.utility.billing.model.UtilityType;
import lombok.Data;

@Data
public class ConsumerConnectionResponse {

    private String id;
    private String consumerId;
    private UtilityType utilityType;
    private String tariffPlanCode;
    private boolean active;
}