package com.ecommerce.project.payload.order;

import com.ecommerce.project.payload.AddressDTO;
import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;
import java.util.List;

@Value
@Builder
public class UserOrderDetailResponse {
    Long orderId;
    String orderStatus;
    Double totalAmount;
    LocalDateTime placedAt;
    List<UserOrderItemView> items;
    AddressDTO shippingAddress;
}

