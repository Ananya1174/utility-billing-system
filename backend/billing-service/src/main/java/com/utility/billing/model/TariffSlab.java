package com.utility.billing.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "tariff_slabs")
public class TariffSlab {

    @Id
    private String id;

    private UtilityType utilityType;
    private String planCode;        

    private long minUnits;
    private long maxUnits;
    private double rate;            
}