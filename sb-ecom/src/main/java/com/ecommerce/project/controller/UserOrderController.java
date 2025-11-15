package com.ecommerce.project.controller;

import com.ecommerce.project.payload.order.UserOrderDetailResponse;
import com.ecommerce.project.payload.order.UserOrderSummary;
import com.ecommerce.project.service.UserOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/orders")
@RequiredArgsConstructor
public class UserOrderController {

    private final UserOrderService userOrderService;

    @GetMapping
    public ResponseEntity<Page<UserOrderSummary>> listOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "placedAt") String sort,
            @RequestParam(defaultValue = "DESC") String direction
    ) {
        Sort sortOrder = "ASC".equalsIgnoreCase(direction)
                ? Sort.by(sort).ascending()
                : Sort.by(sort).descending();
        Pageable pageable = PageRequest.of(page, size, sortOrder);
        return ResponseEntity.ok(userOrderService.getCurrentUserOrders(pageable));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<UserOrderDetailResponse> getOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(userOrderService.getOrderDetail(orderId));
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<UserOrderDetailResponse> cancelOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(userOrderService.cancelOrder(orderId));
    }
}

