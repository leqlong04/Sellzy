package com.ecommerce.project.service;

import com.ecommerce.project.model.AppRole;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.Role;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.seller.SellerProductSummary;
import com.ecommerce.project.payload.seller.SellerProductsResponse;
import com.ecommerce.project.payload.seller.SellerProfileResponse;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SellerProfileService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public SellerProfileResponse getSellerProfile(Long sellerId, int productLimit) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found: " + sellerId));
        ensureSellerRole(seller);

        int resolvedLimit = Math.max(productLimit, 1);
        Page<Product> productPage = productRepository.findByUser(
                seller,
                PageRequest.of(0, resolvedLimit, Sort.by(Sort.Direction.DESC, "productId")));

        long totalProducts = productRepository.countByUser(seller);
        Double avgPrice = productRepository.findAveragePriceByUser(seller);

        List<SellerProductSummary> productSummaries = productPage.getContent().stream()
                .map(this::toSummary)
                .collect(Collectors.toList());

        return SellerProfileResponse.builder()
                .sellerId(seller.getUserId())
                .displayName(seller.getUserName())
                .avatarUrl(seller.getAvatarUrl())
                .headline(seller.getSellerHeadline())
                .description(seller.getSellerDescription())
                .totalProducts(totalProducts)
                .averageProductPrice(avgPrice != null ? avgPrice : 0d)
                .featuredProducts(productSummaries)
                .build();
    }

    public SellerProductsResponse getSellerProducts(Long sellerId, int page, int size) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found: " + sellerId));
        ensureSellerRole(seller);

        int resolvedPage = Math.max(page, 0);
        int resolvedSize = Math.max(Math.min(size, 50), 1);

        Page<Product> productPage = productRepository.findByUser(
                seller,
                PageRequest.of(resolvedPage, resolvedSize, Sort.by(Sort.Direction.DESC, "productId")));

        List<SellerProductSummary> summaries = productPage.getContent()
                .stream()
                .map(this::toSummary)
                .collect(Collectors.toList());

        return SellerProductsResponse.builder()
                .items(summaries)
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .last(productPage.isLast())
                .build();
    }

    private void ensureSellerRole(User seller) {
        Set<AppRole> roles = seller.getRoles().stream()
                .map(Role::getRoleName)
                .collect(Collectors.toSet());
        if (!roles.contains(AppRole.ROLE_SELLER)) {
            throw new IllegalArgumentException("User is not registered as a seller");
        }
    }

    private SellerProductSummary toSummary(Product product) {
        return SellerProductSummary.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .image(product.getImage())
                .description(product.getDescription())
                .price(product.getPrice())
                .specialPrice(product.getSpecialPrice())
                .discount(product.getDiscount())
                .quantity(product.getQuantity())
                .averageRating(product.getAverageRating())
                .ratingCount(product.getRatingCount())
                .build();
    }
}

