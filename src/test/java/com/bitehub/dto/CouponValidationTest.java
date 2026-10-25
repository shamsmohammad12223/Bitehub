package com.bitehub.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertTrue;

class CouponValidationTest {

    private ValidatorFactory validatorFactory;
    private Validator validator;

    @BeforeEach
    void setUp() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterEach
    void tearDown() {
        validatorFactory.close();
    }

    @Test
    void couponValidationRequiresCodeAndNonNegativeSubtotal() {
        CouponValidateRequest request = new CouponValidateRequest(" ", -1.0);

        Set<String> invalidFields = validator.validate(request).stream()
                .map(violation -> violation.getPropertyPath().toString())
                .collect(Collectors.toSet());

        assertTrue(invalidFields.containsAll(Set.of("code", "subtotal")));
    }

    @Test
    void couponCreationRejectsMissingCodeAndNonPositiveDiscount() {
        CouponDTO request = new CouponDTO();
        request.setDiscountValue(0.0);

        Set<String> invalidFields = validator.validate(request).stream()
                .map(violation -> violation.getPropertyPath().toString())
                .collect(Collectors.toSet());

        assertTrue(invalidFields.containsAll(Set.of("code", "discountValue")));
    }

    @Test
    void couponCreationRejectsNegativeAmounts() {
        CouponDTO request = new CouponDTO();
        request.setCode("SAVE10");
        request.setDiscountValue(10.0);
        request.setMinOrderAmount(-1.0);
        request.setMaxDiscountAmount(-1.0);
        request.setUsageLimit(0);

        Set<String> invalidFields = validator.validate(request).stream()
                .map(violation -> violation.getPropertyPath().toString())
                .collect(Collectors.toSet());

        assertTrue(invalidFields.containsAll(Set.of("minOrderAmount", "maxDiscountAmount", "usageLimit")));
    }
}
