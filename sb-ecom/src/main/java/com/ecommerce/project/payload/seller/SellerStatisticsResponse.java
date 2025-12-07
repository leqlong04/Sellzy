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
    private Double totalRevenue; // Total revenue before tax
    private Double totalTaxPaid; // Total tax paid (7% of revenue)
    private Double totalRevenueAfterTax; // Total revenue after deducting tax
    private List<ProductSalesSummary> topSellingProducts; // Top selling products
    private List<MonthlyRevenue> monthlyRevenue; // Revenue by month
}

