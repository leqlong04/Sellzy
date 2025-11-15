package com.ecommerce.project.service;

import com.ecommerce.project.payload.order.UserOrderDetailResponse;
import com.ecommerce.project.payload.order.UserOrderSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserOrderService {
    Page<UserOrderSummary> getCurrentUserOrders(Pageable pageable);

    UserOrderDetailResponse getOrderDetail(Long orderId);

    UserOrderDetailResponse cancelOrder(Long orderId);
}

