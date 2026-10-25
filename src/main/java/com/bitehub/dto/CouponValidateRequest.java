package com.bitehub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class CouponValidateRequest {

    @NotBlank(message = "Coupon code is required")
    private String code;

    @NotNull(message = "Order subtotal is required")
    @PositiveOrZero(message = "Order subtotal must be zero or greater")
    private Double subtotal;

    public CouponValidateRequest() {}

    public CouponValidateRequest(String code, Double subtotal) {
        this.code = code;
        this.subtotal = subtotal;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
}
