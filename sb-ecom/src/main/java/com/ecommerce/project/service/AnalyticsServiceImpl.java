package com.ecommerce.project.service;

import com.ecommerce.project.model.Order;
import com.ecommerce.project.model.OrderItem;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.AnalyticsResponse;
import com.ecommerce.project.repositories.OrderRepository;
import com.ecommerce.project.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {
    
    private static final double STATE_TAX_RATE = 0.07; // 7% state tax
    private static final double STATE_TAX_THRESHOLD = 4000.0; // $4000 threshold for state tax
    
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public AnalyticsResponse getAnalyticsData() {
        AnalyticsResponse response = new AnalyticsResponse();

        long productCount = productRepository.count();
        long totalOrders = orderRepository.count();
        Double totalRevenue = orderRepository.getTotalRevenue();

        // Calculate state tax collected from all sellers
        double totalStateTaxCollected = calculateTotalStateTax();

        response.setProductCount(String.valueOf(productCount));
        response.setTotalOrders(String.valueOf(totalOrders));
        response.setTotalRevenue(String.valueOf(totalRevenue != null ? totalRevenue : 0));
        response.setTotalStateTax(String.valueOf(totalStateTaxCollected));
        
        return response;
    }

    private double calculateTotalStateTax() {
        // Get all orders
        List<Order> allOrders = orderRepository.findAll();
        
        // Group revenue by seller
        Map<Long, Double> sellerRevenueMap = new HashMap<>();
        
        for (Order order : allOrders) {
            // Skip cancelled orders
            if (order.getOrderStatus() != null && order.getOrderStatus().equals("CANCELLED")) {
                continue;
            }
            
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                if (product != null && product.getUser() != null) {
                    Long sellerId = product.getUser().getUserId();
                    double itemRevenue = item.getOrderProductPrice() * item.getQuantity();
                    
                    sellerRevenueMap.merge(sellerId, itemRevenue, Double::sum);
                }
            }
        }
        
        // Calculate state tax for sellers exceeding threshold
        double totalStateTax = 0.0;
        for (Map.Entry<Long, Double> entry : sellerRevenueMap.entrySet()) {
            double sellerRevenue = entry.getValue();
            if (sellerRevenue > STATE_TAX_THRESHOLD) {
                totalStateTax += sellerRevenue * STATE_TAX_RATE;
            }
        }
        
        return totalStateTax;
    }
}
