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

class AuthRequestValidationTest {

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
    void registrationRequiresNameEmailPasswordAndRole() {
        Set<String> invalidFields = validator.validate(new RegisterRequest()).stream()
                .map(violation -> violation.getPropertyPath().toString())
                .collect(Collectors.toSet());

        assertTrue(invalidFields.containsAll(Set.of("name", "email", "password", "role")));
    }

    @Test
    void registrationRejectsInvalidEmailAndShortPassword() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Customer");
        request.setEmail("not-an-email");
        request.setPassword("123");
        request.setRole(com.bitehub.model.Role.ROLE_CUSTOMER);

        Set<String> invalidFields = validator.validate(request).stream()
                .map(violation -> violation.getPropertyPath().toString())
                .collect(Collectors.toSet());

        assertTrue(invalidFields.containsAll(Set.of("email", "password")));
    }

    @Test
    void registrationRejectsValuesThatExceedColumnLimits() {
        RegisterRequest request = new RegisterRequest();
        request.setName("n".repeat(256));
        request.setEmail("a".repeat(250) + "@b.co");
        request.setPassword("secret123");
        request.setPhone("1".repeat(256));
        request.setRole(com.bitehub.model.Role.ROLE_CUSTOMER);

        Set<String> invalidFields = validator.validate(request).stream()
                .map(violation -> violation.getPropertyPath().toString())
                .collect(Collectors.toSet());

        assertTrue(invalidFields.containsAll(Set.of("name", "email", "phone")));
    }

    @Test
    void loginRequiresValidEmailAndPassword() {
        LoginRequest request = new LoginRequest("not-an-email", " ");

        Set<String> invalidFields = validator.validate(request).stream()
                .map(violation -> violation.getPropertyPath().toString())
                .collect(Collectors.toSet());

        assertTrue(invalidFields.containsAll(Set.of("email", "password")));
    }
}
