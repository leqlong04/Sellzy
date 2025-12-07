package com.ecommerce.project.payload.seller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyRevenue {
    private String month; // Format: "YYYY-MM"
    private Integer year;
    private Integer monthNumber;
    private Double revenue; // Revenue before tax
    private Double taxAmount; // Tax paid
    private Double revenueAfterTax; // Revenue after tax
    private Integer orderCount; // Number of orders in this month
}

