package com.ecommerce.project.controller;

import com.ecommerce.project.payload.seller.SellerProductsResponse;
import com.ecommerce.project.payload.seller.SellerProfileResponse;
import com.ecommerce.project.service.SellerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/sellers")
@RequiredArgsConstructor
public class SellerProfileController {

    private final SellerProfileService sellerProfileService;

    @GetMapping("/{sellerId}")
    public ResponseEntity<SellerProfileResponse> getSellerProfile(
            @PathVariable Long sellerId,
            @RequestParam(name = "featuredProducts", defaultValue = "6") int featuredProducts) {
        SellerProfileResponse response = sellerProfileService.getSellerProfile(sellerId, featuredProducts);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{sellerId}/products")
    public ResponseEntity<SellerProductsResponse> getSellerProducts(
            @PathVariable Long sellerId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "12") int size) {
        SellerProductsResponse response = sellerProfileService.getSellerProducts(sellerId, page, size);
        return ResponseEntity.ok(response);
    }
}

