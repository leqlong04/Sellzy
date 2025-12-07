package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long productId;
    private String productName;
    private String image;
    private String description;
    private String detailDescription; // Rich text HTML description
    private Integer quantity;
    private double price;
    private double discount;
    private double specialPrice;
    private Double averageRating;
    private Integer ratingCount;
    private String sellerName;
    private Double taxAmount; // 7% tax on specialPrice
    private Double priceAfterTax; // specialPrice + taxAmount

}
