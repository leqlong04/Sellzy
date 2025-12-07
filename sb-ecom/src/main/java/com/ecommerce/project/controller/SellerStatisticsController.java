package com.ecommerce.project.controller;

import com.ecommerce.project.payload.seller.SellerStatisticsResponse;
import com.ecommerce.project.service.SellerStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seller")
public class SellerStatisticsController {

    @Autowired
    private SellerStatisticsService sellerStatisticsService;

    @GetMapping("/statistics")
    public ResponseEntity<SellerStatisticsResponse> getSellerStatistics() {
        SellerStatisticsResponse statistics = sellerStatisticsService.getSellerStatistics();
        return new ResponseEntity<>(statistics, HttpStatus.OK);
    }
}

