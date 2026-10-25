package com.bitehub.service;

import com.bitehub.dto.CouponValidateRequest;
import com.bitehub.model.Coupon;
import com.bitehub.model.DiscountType;
import com.bitehub.repository.CouponRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CouponServiceTest {

    @Mock
    private CouponRepository couponRepository;

    @Test
    void unknownCouponIsRejectedWithoutDiscount() {
        CouponService couponService = new CouponService(couponRepository);
        when(couponRepository.findByCodeIgnoreCaseAndIsActiveTrue("UNKNOWN"))
                .thenReturn(Optional.empty());

        var response = couponService.validateCoupon(new CouponValidateRequest(" unknown ", 50.0));

        assertFalse(response.isValid());
        assertEquals(0.0, response.getDiscountAmount());
        assertEquals(50.0, response.getNewTotal());
        assertEquals("UNKNOWN", response.getCode());
    }

    @Test
    void validPercentageCouponAppliesDiscountCap() {
        Coupon coupon = new Coupon();
        coupon.setCode("SAVE20");
        coupon.setDiscountType(DiscountType.PERCENTAGE);
        coupon.setDiscountValue(20.0);
        coupon.setMinOrderAmount(0.0);
        coupon.setMaxDiscountAmount(5.0);
        coupon.setActive(true);

        when(couponRepository.findByCodeIgnoreCaseAndIsActiveTrue("SAVE20"))
                .thenReturn(Optional.of(coupon));

        var response = new CouponService(couponRepository)
                .validateCoupon(new CouponValidateRequest("save20", 100.0));

        assertTrue(response.isValid());
        assertEquals(5.0, response.getDiscountAmount());
        assertEquals(95.0, response.getNewTotal());
    }
}
