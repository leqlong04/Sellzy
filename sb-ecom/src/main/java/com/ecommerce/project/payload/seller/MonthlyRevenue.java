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
    private Double revenue; // Revenue before any deductions
    private Double platformFee; // Platform fee (5%)
    private Double stateTax; // State tax (7% if applicable)
    private Double revenueAfterFees; // Revenue after platform fee and state tax
    private Integer orderCount; // Number of orders in this month
}
