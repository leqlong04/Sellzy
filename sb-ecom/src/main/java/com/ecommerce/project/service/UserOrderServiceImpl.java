package com.ecommerce.project.service;

import com.ecommerce.project.model.Order;
import com.ecommerce.project.model.OrderItem;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.ProductReview;
import com.ecommerce.project.payload.AddressDTO;
import com.ecommerce.project.payload.order.UserOrderDetailResponse;
import com.ecommerce.project.payload.order.UserOrderItemView;
import com.ecommerce.project.payload.order.UserOrderSummary;
import com.ecommerce.project.repositories.OrderRepository;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.repositories.ProductReviewRepository;
import com.ecommerce.project.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserOrderServiceImpl implements UserOrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ProductReviewRepository productReviewRepository;
    private final AuthUtil authUtil;
    private final ModelMapper modelMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<UserOrderSummary> getCurrentUserOrders(Pageable pageable) {
        Long userId = authUtil.loggedInUserId();
        return orderRepository.findByUserUserId(userId, pageable)
                .map(this::mapToSummary);
    }

    @Override
    @Transactional(readOnly = true)
    public UserOrderDetailResponse getOrderDetail(Long orderId) {
        Order order = getUserOrder(orderId);
        return mapToDetail(order);
    }

    @Override
    @Transactional
    public UserOrderDetailResponse cancelOrder(Long orderId) {
        Order order = getUserOrder(orderId);
        if (!"PENDING".equalsIgnoreCase(order.getOrderStatus())) {
            throw new IllegalStateException("Only pending orders can be cancelled");
        }

        order.setOrderStatus("CANCELLED");
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            if (product != null) {
                product.setQuantity(product.getQuantity() + item.getQuantity());
                productRepository.save(product);
            }
        }
        Order updated = orderRepository.save(order);
        return mapToDetail(updated);
    }

    private Order getUserOrder(Long orderId) {
        Long userId = authUtil.loggedInUserId();
        return orderRepository.findByOrderIdAndUserUserId(orderId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    }

    private UserOrderSummary mapToSummary(Order order) {
        int totalItems = order.getOrderItems()
                .stream()
                .mapToInt(OrderItem::getQuantity)
                .sum();
        return UserOrderSummary.builder()
                .orderId(order.getOrderId())
                .orderStatus(order.getOrderStatus())
                .totalAmount(order.getTotalAmount())
                .placedAt(order.getPlacedAt())
                .totalItems(totalItems)
                .build();
    }

    private UserOrderDetailResponse mapToDetail(Order order) {
        boolean delivered = "DELIVERED".equalsIgnoreCase(order.getOrderStatus());
        List<UserOrderItemView> items = order.getOrderItems().stream()
                .map(item -> {
                    var reviewOpt = productReviewRepository.findByOrderItem(item);
                    ProductReview review = reviewOpt.orElse(null);
                    return UserOrderItemView.builder()
                        .orderItemId(item.getOrderItemId())
                        .productId(item.getProduct() != null ? item.getProduct().getProductId() : null)
                        .productName(item.getProduct() != null ? item.getProduct().getProductName() : null)
                        .quantity(item.getQuantity())
                        .unitPrice(item.getOrderProductPrice())
                        .discount(item.getDiscount())
                        .lineTotal((item.getOrderProductPrice() - item.getDiscount()) * item.getQuantity())
                        .reviewSubmitted(review != null)
                        .canReview(delivered && review == null)
                        .reviewId(review != null ? review.getReviewId() : null)
                        .reviewRating(review != null ? review.getRating() : null)
                        .reviewTitle(review != null ? review.getTitle() : null)
                        .reviewComment(review != null ? review.getComment() : null)
                        .build();
                })
                .collect(Collectors.toList());

        AddressDTO addressDTO = order.getAddress() != null
                ? modelMapper.map(order.getAddress(), AddressDTO.class)
                : null;

        return UserOrderDetailResponse.builder()
                .orderId(order.getOrderId())
                .orderStatus(order.getOrderStatus())
                .totalAmount(order.getTotalAmount())
                .placedAt(order.getPlacedAt())
                .items(items)
                .shippingAddress(addressDTO)
                .build();
    }
}

