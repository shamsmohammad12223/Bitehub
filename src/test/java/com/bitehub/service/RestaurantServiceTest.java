package com.bitehub.service;

import com.bitehub.repository.RestaurantRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RestaurantServiceTest {

    @Mock
    private RestaurantRepository restaurantRepository;

    @Mock
    private AuthService authService;

    @Mock
    private GeocodingService geocodingService;

    @InjectMocks
    private RestaurantService restaurantService;

    @Test
    void combinesTrimmedSearchAndCuisineFilters() {
        when(restaurantRepository.searchVerifiedRestaurants("spicy noodles", "Asian"))
                .thenReturn(Collections.emptyList());

        assertTrue(restaurantService.getAllVerifiedRestaurants(" spicy noodles ", " Asian ").isEmpty());

        verify(restaurantRepository).searchVerifiedRestaurants("spicy noodles", "Asian");
    }

    @Test
    void supportsCuisineWithoutSearchText() {
        when(restaurantRepository.searchVerifiedRestaurants(null, "Italian"))
                .thenReturn(Collections.emptyList());

        assertTrue(restaurantService.getAllVerifiedRestaurants(" ", "Italian").isEmpty());

        verify(restaurantRepository).searchVerifiedRestaurants(null, "Italian");
    }

    @Test
    void listsAllVerifiedRestaurantsWhenFiltersAreEmpty() {
        when(restaurantRepository.findByIsVerifiedTrue()).thenReturn(Collections.emptyList());

        assertTrue(restaurantService.getAllVerifiedRestaurants(null, "all").isEmpty());

        verify(restaurantRepository).findByIsVerifiedTrue();
        verifyNoInteractions(authService, geocodingService);
    }
}
