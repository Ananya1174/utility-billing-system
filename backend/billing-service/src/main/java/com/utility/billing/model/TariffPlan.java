package com.utility.billing.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "tariff_plans")
public class TariffPlan {

    @Id
    private String id;

    private UtilityType utilityType;   
    private String planCode;           

    private boolean active;
}