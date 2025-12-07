package com.ecommerce.project.payload.seller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerStatisticsResponse {
    private Long totalProductsSold; // Total quantity of products sold
    private Integer totalOrders; // Total number of orders
    private Double totalRevenue; // Total revenue before any deductions
    private Double totalPlatformFee; // Total platform fee (5% of revenue)
    private Double totalStateTax; // Total state tax (7% if revenue > $4000, otherwise 0)
    private Double totalRevenueAfterFees; // Total revenue after deducting platform fee and state tax
    private List<ProductSalesSummary> topSellingProducts; // Top selling products
    private List<MonthlyRevenue> monthlyRevenue; // Revenue by month
}
