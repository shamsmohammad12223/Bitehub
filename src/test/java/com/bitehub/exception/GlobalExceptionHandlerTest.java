package com.bitehub.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler exceptionHandler = new GlobalExceptionHandler();

    @Test
    void badCredentialsReturnUnderstandableGenericMessage() {
        var response = exceptionHandler.handleBadCredentials(
                new BadCredentialsException("internal authentication detail"));

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid email or password", response.getBody().getMessage());
    }

    @Test
    void disabledAccountReturnsClearAuthenticationError() {
        var response = exceptionHandler.handleDisabledAccount(
                new DisabledException("internal account state"));

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("This account has been disabled. Contact support.", response.getBody().getMessage());
    }

    @Test
    void unexpectedErrorsDoNotExposeExceptionDetails() {
        var response = exceptionHandler.handleGeneral(
                new IllegalStateException("database password and query details"));

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertFalse(response.getBody().getMessage().contains("database"));
        assertEquals("Something went wrong on our side. Please try again.",
                response.getBody().getMessage());
    }
}
