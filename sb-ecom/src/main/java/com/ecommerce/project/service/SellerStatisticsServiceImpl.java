package com.ecommerce.project.service;

import com.ecommerce.project.model.Order;
import com.ecommerce.project.model.OrderItem;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.seller.MonthlyRevenue;
import com.ecommerce.project.payload.seller.ProductSalesSummary;
import com.ecommerce.project.payload.seller.SellerStatisticsResponse;
import com.ecommerce.project.repositories.OrderRepository;
import com.ecommerce.project.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SellerStatisticsServiceImpl implements SellerStatisticsService {

    private static final double PLATFORM_FEE_RATE = 0.05; // 5% platform fee
    private static final double STATE_TAX_RATE = 0.07; // 7% state tax
    private static final double STATE_TAX_THRESHOLD = 4000.0; // $4000 threshold for state tax

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private AuthUtil authUtil;

    @Override
    public SellerStatisticsResponse getSellerStatistics() {
        User seller = authUtil.loggedInUser();
        
        // Get all orders that contain products from this seller
        List<Order> allOrders = orderRepository.findAll();
        
        List<Order> sellerOrders = allOrders.stream()
                .filter(order -> order.getOrderItems().stream()
                        .anyMatch(orderItem -> {
                            Product product = orderItem.getProduct();
                            return product != null && 
                                   product.getUser() != null &&
                                   product.getUser().getUserId().equals(seller.getUserId());
                        }))
                .filter(order -> order.getOrderStatus() != null && 
                                !order.getOrderStatus().equals("CANCELLED"))
                .toList();

        // Calculate statistics
        long totalProductsSold = 0;
        double totalRevenue = 0.0;
        
        Map<Long, ProductSalesData> productSalesMap = new HashMap<>();
        Map<String, MonthlyRevenueData> monthlyRevenueMap = new HashMap<>();
        
        // First pass: Calculate total revenue to determine if state tax applies
        for (Order order : sellerOrders) {
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                if (product == null || product.getUser() == null || 
                    !product.getUser().getUserId().equals(seller.getUserId())) {
                    continue;
                }
                
                double itemRevenue = item.getOrderProductPrice() * item.getQuantity();
                totalRevenue += itemRevenue;
                totalProductsSold += item.getQuantity();
            }
        }
        
        // Determine if state tax applies based on total revenue
        boolean applyStateTax = totalRevenue > STATE_TAX_THRESHOLD;
        
        // Calculate fees
        double totalPlatformFee = totalRevenue * PLATFORM_FEE_RATE;
        double totalStateTax = applyStateTax ? totalRevenue * STATE_TAX_RATE : 0.0;
        double totalRevenueAfterFees = totalRevenue - totalPlatformFee - totalStateTax;
        
        // Second pass: Build detailed statistics with per-item fee calculations
        for (Order order : sellerOrders) {
            String monthKey = order.getOrderDate() != null 
                    ? order.getOrderDate().format(DateTimeFormatter.ofPattern("yyyy-MM"))
                    : LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
            
            MonthlyRevenueData monthData = monthlyRevenueMap.computeIfAbsent(monthKey, 
                    k -> new MonthlyRevenueData(monthKey));
            monthData.orderCount++;
            
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                if (product == null || product.getUser() == null || 
                    !product.getUser().getUserId().equals(seller.getUserId())) {
                    continue;
                }
                
                // Calculate revenue and fees for this item
                double itemRevenue = item.getOrderProductPrice() * item.getQuantity();
                double itemPlatformFee = itemRevenue * PLATFORM_FEE_RATE;
                double itemStateTax = applyStateTax ? itemRevenue * STATE_TAX_RATE : 0.0;
                double itemRevenueAfterFees = itemRevenue - itemPlatformFee - itemStateTax;
                
                // Aggregate by product
                ProductSalesData productData = productSalesMap.computeIfAbsent(
                        product.getProductId(), 
                        k -> new ProductSalesData(product.getProductId(), product.getProductName()));
                productData.quantitySold += item.getQuantity();
                productData.revenue += itemRevenue;
                productData.platformFee += itemPlatformFee;
                productData.stateTax += itemStateTax;
                productData.revenueAfterFees += itemRevenueAfterFees;
                
                // Aggregate by month
                monthData.revenue += itemRevenue;
                monthData.platformFee += itemPlatformFee;
                monthData.stateTax += itemStateTax;
                monthData.revenueAfterFees += itemRevenueAfterFees;
            }
        }
        
        // Build top selling products (top 10)
        List<ProductSalesSummary> topSellingProducts = productSalesMap.values().stream()
                .sorted((a, b) -> Long.compare(b.quantitySold, a.quantitySold))
                .limit(10)
                .map(data -> new ProductSalesSummary(
                        data.productId,
                        data.productName,
                        data.quantitySold,
                        data.revenue,
                        data.platformFee,
                        data.stateTax,
                        data.revenueAfterFees))
                .collect(Collectors.toList());
        
        // Build monthly revenue
        List<MonthlyRevenue> monthlyRevenue = monthlyRevenueMap.values().stream()
                .sorted(Comparator.comparing(MonthlyRevenueData::getMonthKey).reversed())
                .limit(12) // Last 12 months
                .map(data -> {
                    String[] parts = data.monthKey.split("-");
                    return new MonthlyRevenue(
                            data.monthKey,
                            Integer.parseInt(parts[0]),
                            Integer.parseInt(parts[1]),
                            data.revenue,
                            data.platformFee,
                            data.stateTax,
                            data.revenueAfterFees,
                            data.orderCount);
                })
                .collect(Collectors.toList());
        
        return new SellerStatisticsResponse(
                totalProductsSold,
                sellerOrders.size(),
                totalRevenue,
                totalPlatformFee,
                totalStateTax,
                totalRevenueAfterFees,
                topSellingProducts,
                monthlyRevenue
        );
    }
    
    // Helper classes for aggregation
    private static class ProductSalesData {
        Long productId;
        String productName;
        long quantitySold = 0;
        double revenue = 0.0;
        double platformFee = 0.0;
        double stateTax = 0.0;
        double revenueAfterFees = 0.0;
        
        ProductSalesData(Long productId, String productName) {
            this.productId = productId;
            this.productName = productName;
        }
    }
    
    private static class MonthlyRevenueData {
        String monthKey;
        double revenue = 0.0;
        double platformFee = 0.0;
        double stateTax = 0.0;
        double revenueAfterFees = 0.0;
        int orderCount = 0;
        
        MonthlyRevenueData(String monthKey) {
            this.monthKey = monthKey;
        }
        
        String getMonthKey() {
            return monthKey;
        }
    }
}
