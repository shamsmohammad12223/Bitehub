package com.bitehub.service;

import com.bitehub.config.JwtTokenProvider;
import com.bitehub.dto.AuthResponse;
import com.bitehub.dto.RegisterRequest;
import com.bitehub.exception.BadRequestException;
import com.bitehub.model.Role;
import com.bitehub.model.User;
import com.bitehub.repository.DeliveryPersonnelRepository;
import com.bitehub.repository.RestaurantRepository;
import com.bitehub.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RestaurantRepository restaurantRepository;
    @Mock
    private DeliveryPersonnelRepository deliveryPersonnelRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtTokenProvider tokenProvider;
    @Mock
    private GeocodingService geocodingService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(
                userRepository,
                restaurantRepository,
                deliveryPersonnelRepository,
                passwordEncoder,
                authenticationManager,
                tokenProvider,
                geocodingService);
    }

    @Test
    void registerRejectsEmailAlreadyRegisteredIgnoringCase() {
        RegisterRequest request = customerRequest("  CUSTOMER@EXAMPLE.COM ");
        when(userRepository.existsByEmailIgnoreCase("customer@example.com")).thenReturn(true);

        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> authService.register(request));

        assertEquals("Email is already registered.", exception.getMessage());
        verify(userRepository, never()).saveAndFlush(any(User.class));
    }

    @Test
    void registerStoresNormalizedEmail() {
        RegisterRequest request = customerRequest("  CUSTOMER@EXAMPLE.COM ");
        when(userRepository.existsByEmailIgnoreCase("customer@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("encoded-password");
        when(userRepository.saveAndFlush(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(12L);
            return user;
        });
        when(tokenProvider.generateToken("customer@example.com", Role.ROLE_CUSTOMER.name()))
                .thenReturn("token");

        AuthResponse response = authService.register(request);

        assertEquals("customer@example.com", response.getEmail());
        verify(userRepository).saveAndFlush(org.mockito.ArgumentMatchers.argThat(
                user -> user.getEmail().equals("customer@example.com")));
    }

    @Test
    void registerReturnsClearErrorForConcurrentDuplicate() {
        RegisterRequest request = customerRequest("customer@example.com");
        when(userRepository.existsByEmailIgnoreCase("customer@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("encoded-password");
        doThrow(new DataIntegrityViolationException("database details"))
                .when(userRepository).saveAndFlush(any(User.class));

        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> authService.register(request));

        assertEquals("Email is already registered.", exception.getMessage());
    }

    private RegisterRequest customerRequest(String email) {
        RegisterRequest request = new RegisterRequest();
        request.setName("Customer");
        request.setEmail(email);
        request.setPassword("secret123");
        request.setRole(Role.ROLE_CUSTOMER);
        return request;
    }
}
