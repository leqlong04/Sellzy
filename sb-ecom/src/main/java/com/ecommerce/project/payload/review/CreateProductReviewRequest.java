package com.ecommerce.project.payload.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateProductReviewRequest {

    @NotNull
    private Long orderItemId;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    private String title;

    private String comment;
}

