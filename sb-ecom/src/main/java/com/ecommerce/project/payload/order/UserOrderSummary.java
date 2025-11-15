package com.ecommerce.project.payload.order;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class UserOrderSummary {
    Long orderId;
    String orderStatus;
    Double totalAmount;
    LocalDateTime placedAt;
    int totalItems;
}

